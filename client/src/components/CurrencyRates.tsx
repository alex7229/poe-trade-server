import * as React from 'react';
import { Request } from '../Helpers/Request';
import { CurrencyRatesComponent } from '../types';
import Props = CurrencyRatesComponent.Props;
import State = CurrencyRatesComponent.State;
import { SmartInput } from './SmartInput';

export class CurrencyRates extends React.Component<Props, State> {

    constructor(props: CurrencyRatesComponent.Props) {
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