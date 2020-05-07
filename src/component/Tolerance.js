import React, { Component } from 'react'
import Form from 'muicss/lib/react/form';
import Input from 'muicss/lib/react/input';

export class Tolerance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tolerance: '',
        }
    }


    componentWillUpdate(nextProps, nextState) {
        if (nextProps.disabled && this.state.tolerance !== '') {
            this.setState({ tolerance: '' })
        }
    }

    onChange = (e) => {
        this.props.setTolerance(e.currentTarget.value)
        this.setState({ tolerance: e.currentTarget.value })
    }

    

    render() {
        return (
            <Form className='tolerance-form'>
                <Input
                    type='text'
                    name='tolerance'
                    value={this.state.tolerance}
                    placeholder='Tolerance'
                    onChange={this.onChange}
                    disabled={this.props.disabled}
                >
                </Input>
            </Form>
        )
    }
}

export default Tolerance
