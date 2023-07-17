import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import EssayList from '../List';

import { getPublicEssayURL } from '../util';
import * as ROUTES from '../../../constants/routes';
import ConfirmDialog from '../../../util/ConfirmDialog';
import playListService from '../../../service/PlayListService';

class MyEssayListPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentEssayList: {}, // [{id: number, name: string, essays: [{id: number, title: string}]}],
      showDeleteConfirm: false,
      itemToDelete: null,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchCurrentEssayList();
  }

  componentDidUpdate(prevPros) {
    let id = this.getCurrentEssayListId(this.props);
    if (id && id !== this.getCurrentEssayListId(prevPros)) {
      this.fetchCurrentEssayList();
    }
  }

  handleError(error) {
    console.error(error);
    this.setState({
      error: error.message,
      loading: false,
    });
  }

  getCurrentEssayListId = (props) => {
    return props.match.params.id;
  };

  getEssaysFromItem = (item) => {
    item = item || [];
    const essays = [];
    item.forEach(({ essay }) => {
      // exclude item that has no essay
      if (essay) {
        essays.push(essay);
      }
    });
    return essays;
  };

  fetchCurrentEssayList = async () => {
    try {
      this.setState({
        loading: true,
      });
      let id = this.getCurrentEssayListId(this.props);
      let currentEssayList = await playListService.getEssayListById(id);
      this.setState({
        currentEssayList,
        error: null,
        loading: false,
        showDeleteConfirm: false,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleDelete = async () => {
    try {
      this.toggleDeleteConfirm(false);
      let id = this.getCurrentEssayListId(this.props);
      await playListService.delete(id);
      this.props.history.push(ROUTES.ESSAY);
    } catch (e) {
      this.handleError(e);
    }
  };

  toggleDeleteConfirm = (show) => {
    this.setState({
      showDeleteConfirm: show,
    });
  };

  setItemToDelete = (item) => {
    this.setState({
      itemToDelete: item,
    });
  };

  handleDeleteItem = async () => {
    try {
      const { itemToDelete } = this.state;
      const id = this.getCurrentEssayListId(this.props);
      await playListService.deleteItem(id, [
        {
          essay: { id: itemToDelete.id },
        },
      ]);
      this.fetchCurrentEssayList();
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({
        itemToDelete: null,
      });
    }
  };

  handleSelectEssay = (essay) => {
    this.props.history.push(getPublicEssayURL(essay.id));
  };

  render() {
    const { currentEssayList, error, loading, showDeleteConfirm, itemToDelete } = this.state;
    let { name, item } = currentEssayList;
    const headerStyle = {
      height: 72,
      marginBottom: 4,
      padding: '0 1rem',
    };
    const contentStyle = {
      height: `calc(100% - ${headerStyle.height + headerStyle.marginBottom}px)`,
    };
    const essays = this.getEssaysFromItem(item);
    return (
      <>
        <header style={headerStyle}>
          <div className="d-flex flex-row align-items-center">
            <h5 className="p-0 m-0 mr-2 text-white">{name}</h5>
            {!error && (
              <Button className="btn-tertiary-light" size="sm" onClick={() => this.toggleDeleteConfirm(true)}>
                Delete
              </Button>
            )}
          </div>
        </header>
        <div className="overflow-auto" style={contentStyle}>
          {loading && <div className="text-center w-100">Loading...</div>}
          {!loading && error && <div className="text-center text-danger w-100">{error}</div>}
          {!loading && !error && !essays.length && <div className="text-white">No essays</div>}
          {!loading && !error && essays.length > 0 && (
            <div className="d-flex flex-row h-100">
              <div className="col h-100 overflow-auto">
                <AllEssays essays={essays} onSelect={this.handleSelectEssay} onDelete={this.setItemToDelete} />
              </div>
            </div>
          )}
        </div>
        <ConfirmDialog
          show={showDeleteConfirm}
          title="Delete essay list"
          onClose={() => this.toggleDeleteConfirm(false)}
          onSubmit={this.handleDelete}
        >
          Are you sure you want to delete the essay list?
        </ConfirmDialog>
        <ConfirmDialog
          show={itemToDelete != null}
          title="Delete essay from list"
          onClose={() => this.setItemToDelete(null)}
          onSubmit={this.handleDeleteItem}
        >
          Are you sure you want to delete the essay from list?
        </ConfirmDialog>
      </>
    );
  }
}

const AllEssays = ({ essays, onSelect, onDelete }) => (
  <EssayList essays={essays} view="grid" onClick={onSelect} onDelete={onDelete} />
);

export default withRouter(MyEssayListPage);
