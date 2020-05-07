import React, { Component } from 'react'
import { FormControl, FormControlLabel, Switch } from '@material-ui/core';

export class DraggableMarkerSwitch extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOn: false
        }
    }

    onChange = (e) => {
        this.setState({ isOn: !this.state.isOn })
        this.props.setSwitchTrigger()
    }
    

    render() {
        return (
            <FormControl component='fieldset'>
                <FormControlLabel
                    control={
                        <Switch
                            checked={this.state.isOn}
                            onChange={this.onChange}
                            name='draggableMarker'
                            color='primary'
                        />
                    }
                    label='Draggable Marker'
                />
            </FormControl>
        )
    }
}

export default DraggableMarkerSwitch
