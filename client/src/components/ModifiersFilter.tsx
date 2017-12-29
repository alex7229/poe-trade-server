import * as React from 'react';
import { SmartInput } from './SmartInput';
import { Modifiers } from '../types';
import { Request } from '../Helpers/Request';

interface State {
    modifiers: Modifiers.Modifier[];
}

export class ModifiersFilter extends React.Component<{}, State> {
    constructor (props: {}) {
        super(props);
        this.state = {modifiers: []};
    }

    componentWillMount() {
        Request.fetchGetJson('/modifiers/names')
            .then((res: string) => {
                this.setState({modifiers: JSON.parse(res)});
            })
            .catch(err => {
                throw new Error(err.message);
            });
    }

    render() {
        return (
            <div>
                <SmartInput
                    values={this.state.modifiers.map((modifier) => (modifier.name))}
                    limit={6}
                />
            </div>
        );
    }
}