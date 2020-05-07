import React, { Component } from 'react'

import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

export class ElevationGain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            elevationGain: 'none'
        }
    }

    onChange = (e) => {
        this.setState({ elevationGain: e.target.value })
        this.props.setElevationGain(e.target.value)
    }
    

    render() {
        return (
            <form>
                <Select
                    name='elevationGainOption'
                    value={this.state.elevationGain}
                    defaultValue='none'
                    className='elevationGain-select'
                    onChange={this.onChange}
                >
                    <Option value='none' label='None'/>
                    <Option value='max' label='Max'/>
                    <Option value='min' label='Min'/>
                </Select>
            </form>
        )
    }
}

export default ElevationGain
