import React, { Component } from 'react';

import Layout from '../../components/Layout';

import { Button, Form, Input, Message } from 'semantic-ui-react';

import factory from '../../ethereum/factory';

import web3 from '../../ethereum/web3';

import { Router } from '../../routes';

class CampaignNew extends Component {

    state = {
        minimumContribution: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        // Event handler that handles the form on submitting
        event.preventDefault();  //That keeps the browser from attending to submit the form
        
        this.setState({ loading: true, errorMessage: '' }); //reinitialising the error message for the next submission

        try 
        {
            const accounts = await web3.eth.getAccounts();
            //Create a new camapign

            await factory.methods.createCampaign(this.state.minimumContribution)
            .send({
                // here the metamask automatically calculates the amount of gas needed to run the function
                // therefoere we dont specify the gas amount

                from: accounts[0]   //Assuming here that user has at least one account to send the transaction. The manager is not charged here     
            });
            
            Router.pushRoute('/');  // after the completion of the campaign, we redirect the user back to the index page

        }

        catch(err) 
        {   
            this.setState( {errorMessage: err.message} );
        }

        this.setState( {loading: false} );

    }

    render() {
        return (
        <Layout>
            <h3>Create a Campaign!</h3>

            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Minimum Contribution</label>
                    <Input 
                    label="wei" labelPosition="right"
                    value = {this.state.minimumContribution}
                    onChange={event => this.setState({minimumContribution: event.target.value})}        
                    />
                </Form.Field>
                <Message error header="Oops!" content={this.state.errorMessage} />
                <Button loading={this.state.loading} primary>Create!</Button>
            </Form>
        </Layout>
        );
    }

}

export default CampaignNew;