import API from '../../utils/API';
import useIsMounted from '../isMounted';
import { useState, useEffect } from 'react';
import { errorType, repoData, } from '../../types';
import { ADD_PROJECT_TO_CACHE } from '../../actions';
import { useProjectCache } from '../../providers/AttacheProjectCache';


export default function useProjectData(props: {
    searchByName?: string;
    project?: repoData;
}) {
    const isMounted = useIsMounted();
    const { searchByName, project } = props;
    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState<errorType>(null);
    const [_data, setData] = useState<repoData | null>(null);
    const [projectState, dispatch] = useProjectCache();


    const getProjectData = () => {
        API.getRepo(searchByName || '').then(_res => {
            const { data, error } = _res;

            data && dispatch({ type: ADD_PROJECT_TO_CACHE, payload: data });

            if (error) { // NOSONAR
                throw new Error(error?.message || 'An error occurred');
            }
        });
    };

    useEffect(() => {
        if (isMounted && searchByName) {
            setLoading(true);

            try {
                // look for the project in the cache
                const isInCache = projectState?.projects[searchByName];

                // if the project wasn't found in the cache, fetch it from the API
                isInCache === undefined && getProjectData();

                // if it was found or updated from the fetch, set the data
                isInCache && setData(isInCache[searchByName]);

            } catch (error) {
                setErrors(`Could not fetch repo data for ${searchByName}: ` + error);
            }

            setLoading(false);
        }

        if (isMounted && project) {
            setData(project);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted, searchByName, project, projectState]);


    return {
        loading,
        error,
        data: _data
    };
}
