import * as React from 'react';
import { SmartInputComponent } from '../types';
import Props = SmartInputComponent.Props;
import State = SmartInputComponent.State;

export class SmartInput extends React.Component<Props, State> {
    constructor (props: Props) {
        super(props);
        this.state = ({input: '', possibleValues: []});

        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div>
                <input onChange={this.handleChange} />
                <div className="popupList">
                    {this.state.possibleValues.map((value) => (<li key={value}>{value}</li>))}
                </div>
            </div>

        );
    }

    handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const currentValue: string = event.target.value;
        this.setState({
            input: currentValue,
            possibleValues: this.getPossibleValues(currentValue)
        });
    }

    getPossibleValues(currentInput: string): string[] {
        return this.props.values.filter((value) => {
            const regExp = new RegExp(currentInput, 'i');
            return regExp.test(value);
        }).slice(0, this.props.limit);
    }

}