import * as React from 'react';
import { Request } from '../Helpers/Request';
import { Currency } from '../types';
import { SmartInput } from './SmartInput';

interface Props {
    currencyFrom: Currency.Quantity;
    currencyToName: string;
}

interface State {
    currencyNames: string[];
}

export class CurrencyRates extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {currencyNames: []};
    }

    componentWillMount() {
        Request.fetchGetJson('/currency/names')
            .then((res: string) => {
                this.setState({currencyNames: JSON.parse(res)});
            })
            .catch(err => {
                throw new Error('cannot get currencies');
            });
    }

    render() {
        return (
            <div>
                <SmartInput
                    values={this.state.currencyNames}
                    limit={6}
                />
            </div>
        );
    }

}