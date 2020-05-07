import React, { Component } from 'react'

import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

export class MultiPathOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 1
        }
    }

    onChange = (e) => {
        this.setState({ number: e.target.value })
        this.props.setNumber(e.target.value)
    }
    

    render() {
        return (
            <form>
                <Select
                    name='multiPathOption'
                    value={this.state.number}
                    defaultValue='1'
                    className='multiPathOption-select'
                    onChange={this.onChange}
                >
                    <Option value={1} label='1'/>
                    <Option value={2} label='2'/>
                    <Option value={3} label='3'/>
                </Select>
            </form>
        )
    }
}

export default MultiPathOption
