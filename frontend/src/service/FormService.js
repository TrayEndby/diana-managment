import AbstractService from './AbstractService';

class FormService extends AbstractService {
    getForms = async () => {
        const { form: response } = await this.post('/form/list');
        return response;
    };

    getFormDetails = async (formId) => {
        const {
            form: [response],
        } = await this.post('/form/get', { form: { id: formId } });
        return response;
    };

    deleteForm = async (formId) => {
        await this.post('/form/delete', { form: { id: formId } });
    };

    createNewForm = async (name, content) => {
        const {
            form: [response],
        } = await this.post('/form/add', { form: { name, item: [{ prompt: content }] } });
        return response;
    };

    updateForm = async (name, content, form) => {
        const req = {
            form: {
                id: form.id,
            },
        };

        if (form.name !== name) {
            req.form.name = name;
        }

        if (form.item[0].prompt !== content) {
            req.form.item = [{ id: form.item[0].id, prompt: content }];
        }

        await this.post('/form/update', req);
    };
}

export default new FormService();
