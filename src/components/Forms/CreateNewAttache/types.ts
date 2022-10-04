import { AttacheFormData } from './Fragments';

export interface FormInputState {
    name: string;
    liveUrl: string;
}

export interface AttacheState {
    projectData: FormInputState[];
    details: AttacheFormData
}


