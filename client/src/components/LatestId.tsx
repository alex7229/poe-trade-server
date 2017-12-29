import * as React from 'react';
import { Request } from '../Helpers/Request';

interface State {
    latestId: string;
}

export class LatestId extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props);
        this.state = {latestId: ''};
    }

    componentWillMount() {
        Request.fetchGetJson('/officialApi/findLatestId')
            .then((res: string) => {
                this.setState({latestId: JSON.parse(res).id});
            })
            .catch(err => {
                throw new Error('cannot get latest id');
            });
    }

    render() {
        return (
            <div>Latest id: "{this.state.latestId}"</div>
        );
    }

}