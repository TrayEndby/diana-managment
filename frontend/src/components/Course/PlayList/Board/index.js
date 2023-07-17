import React from 'react';
import { withRouter } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';

import CourseCard from '../../Card';

import ConfirmDialog from 'util/ConfirmDialog';
import DocItemList from 'util/DocItemList';

import * as ROUTES from 'constants/routes';
import playListService from 'service/PlayListService';

class PlayListBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playList: null, // [{id: number, name: string, courses: [{id: number, title: string}]}],
      savedLists: null, // [{id: number, name: string, created_ts: string}]
      showDeleteConfirm: false,
      itemToDelete: null,
      error: null,
      quickCourseDuration: 10, // 10 minutes
    };
  }

  componentDidMount() {
    this.fetchPlayList();
  }

  componentDidUpdate(prevPros) {
    const id = this.getPalyListId(this.props);
    if (id !== this.getPalyListId(prevPros)) {
      this.fetchPlayList();
    }
  }

  handleError(error) {
    console.error(error);
    this.setState({
      error: error.message,
    });
  }

  getPalyListId = (props) => {
    return props.match.params.id;
  };

  fetchPlayList = async () => {
    try {
      const id = this.getPalyListId(this.props);
      let playList = null;
      let savedLists = null;
      if (id) {
        playList = await playListService.getVideoListById(id);
      } else {
        const res = await playListService.listVideos();
        savedLists = res.map((list) => {
          return {
            ...list,
            title: list.name,
            updated_ts: list.created_ts,
          };
        });
      }
      this.setState({
        playList,
        savedLists,
        error: null,
      });
    } catch (e) {
      this.handleError(e);
    }
  };

  handleDelete = async () => {
    try {
      this.toggleDeleteConfirm(false);
      let id = this.getPalyListId(this.props);
      await playListService.delete(id);
      this.props.history.push(ROUTES.COURSE);
    } catch (e) {
      this.handleError(e);
    }
  };

  toggleDeleteConfirm = (show) => {
    this.setState({
      showDeleteConfirm: show,
    });
  };

  handleQuickCourseDuration = (duration) => {
    this.setState({
      quickCourseDuration: Number(duration),
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
      const id = this.getPalyListId(this.props);
      await playListService.deleteItem(id, [
        {
          video: { vid: itemToDelete.vid },
        },
      ]);
      this.fetchPlayList();
    } catch (e) {
      this.handleError(e);
    } finally {
      this.setState({
        itemToDelete: null,
      });
    }
  };

  render() {
    const {
      playList,
      savedLists,
      quickCourseDuration,
      error,
      showDeleteConfirm,
      itemToDelete,
    } = this.state;
    if (error) {
      return <div className="text-center w-100">{this.state.error}</div>;
    }

    if (!playList && savedLists) {
      return (
        <DocItemList
          label="Playlists"
          items={savedLists}
          noDelete
          noShare
          wholePage
          onSelect={(id) => {
            this.props.history.push(`${ROUTES.COURSE_PLAYLIST}/${id}`);
          }}
        />
      );
    }

    if (!playList) {
      return <div className="text-center w-100 text-white">Loading...</div>;
    }

    let { name, tag, item } = playList;
    const headerStyle = {
      height: 72,
      marginBottom: 4,
      padding: '0 1rem',
    };
    const contentStyle = {
      height: `calc(100% - ${headerStyle.height + headerStyle.marginBottom}px)`,
    };

    // exclude playlist that don't have vid
    item = item || [];
    item = item.filter(({ video }) => video != null);
    return (
      <>
        <header style={headerStyle}>
          <div className="d-flex flex-row align-items-center">
            <Button
              size="sm"
              className="mr-2"
              onClick={() => {
                this.props.history.push(ROUTES.COURSE_PLAYLIST);
              }}
            >
              Back
            </Button>
            <h5 className="p-0 m-0 mr-2 text-white">Play list: {name}</h5>
            <Button
              className="btn-tertiary-light"
              size="sm"
              onClick={() => this.toggleDeleteConfirm(true)}
            >
              Delete
            </Button>
          </div>
          <TagList tag={tag} />
        </header>
        <div className="overflow-auto" style={contentStyle}>
          {item && item.length ? (
            <>
              <QuickCourses
                item={item}
                duration={quickCourseDuration}
                onChangeDuration={this.handleQuickCourseDuration}
                onDelete={this.setItemToDelete}
              />
              <AllCourses item={item} onDelete={this.setItemToDelete} />
            </>
          ) : (
            <div className="px-3 text-white">No videos</div>
          )}
        </div>
        <ConfirmDialog
          show={showDeleteConfirm}
          title="Delete playlist"
          onClose={() => this.toggleDeleteConfirm(false)}
          onSubmit={this.handleDelete}
        >
          Are you sure you want to delete the playlist?
        </ConfirmDialog>
        <ConfirmDialog
          show={itemToDelete != null}
          title="Delete course from playlist"
          onClose={() => this.setItemToDelete(null)}
          onSubmit={this.handleDeleteItem}
        >
          Are you sure you want to delete the course from playlist?
        </ConfirmDialog>
      </>
    );
  }
}

const TagList = ({ tag }) =>
  tag && tag.length ? (
    <div className="my-2 d-flex flex-row align-items-center">
      <div>Tags:</div>
      <div>
        {tag.map((tagName) => (
          <div key={tagName} className="col">
            <Button variant="primary" size="sm">
              {tagName}
            </Button>
          </div>
        ))}
      </div>
    </div>
  ) : null;

const VideoCard = ({ video, onDelete }) => (
  <CourseCard view="grid" course={video} onDelete={onDelete} />
);

const QuickCourses = ({ item, duration, onChangeDuration, onDelete }) => {
  if (!item) {
    return null;
  }
  const durationInSecond = duration * 60;
  item = item.filter(({ video }) => video && video.duration < durationInSecond);
  return (
    <div className="my-2">
      <h6 className="d-flex flex-row align-items-center px-3">
        <h6 className="text-white">Quick course bites</h6>
        <Dropdown className="mx-2" onSelect={onChangeDuration}>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            {`Under ${duration} minutes`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="10">Under 10 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="20">Under 20 minutes</Dropdown.Item>
            <Dropdown.Item eventKey="30">Under 30 minutes</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </h6>
      <div className="App-grid-list">
        {item.length ? (
          item.map(({ video }, index) => (
            <VideoCard key={index} video={video} onDelete={onDelete} />
          ))
        ) : (
          <div className="px-3 text-white">No videos</div>
        )}
      </div>
    </div>
  );
};

const AllCourses = ({ item, onDelete }) => (
  <div className="my-2">
    <h6 className="text-white px-3">All Courses</h6>
    <div className="App-grid-list">
      {item.map(({ video }, index) => (
        <VideoCard key={index} video={video} onDelete={onDelete} />
      ))}
    </div>
  </div>
);

export default withRouter(PlayListBoard);
