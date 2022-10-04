import { AttacheDetailsDefaultFormData } from './Fragments/AttacheDetails';
import { AttacheState, FormInputState } from './types';

export const defaultAttacheState: AttacheState = {
    projectData: [],
    details: AttacheDetailsDefaultFormData
};

export const defaultFormInputState: FormInputState = {
    name: '',
    liveUrl: ''
};

export const maxNumProjects = 8;

export const minNumProjects = 6;


