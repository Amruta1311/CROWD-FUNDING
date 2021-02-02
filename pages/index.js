//Naming this page as index.js, .next modules assume it to be the landing page and 
//directly routes to this page upon opening localhost:3000

import React, { Component } from 'react';

import { Card, Button } from 'semantic-ui-react';

import factory from '../ethereum/factory';

import Layout from '../components/Layout';

import { Link } from '../routes';
// we can the function getDeployedCampaigns from the factory 
// We redefine our component from a functional component to a class based component
//This helps us to use the lifecycle method ComponentDidMount to load up some data inside of the component

class CampaignIndex extends Component {

    static async getInitialProps() { 
        
    // static defines a class function that is not assigned to the instances of the class but instead assigned to the class itself 
        
    //Next does this to retrieve the initial data without rendering any component that may be computationally expensive process.
        
        const campaigns = await factory.methods.getDeployedCampaign().call();

        return { campaigns };   //This is an object of arrays that is returned to our component as props
    
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (<Link route={`/campaigns/${address}`}><a>View Campaign</a></Link>),
                fluid: true //makes sure that the card wrapers up from left to right completely
            };
        });

        return <Card.Group items = {items} />
    }

// Whenever we make a react component we do need to return some JSX from the render method
// So even though we are not going to make use of this data just yet we do have to put out some minimum amount of JSX
// otherwise we may get an error thrown

    render() {

        return (
        <Layout>
            <div>
                {/* <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link> */}
                <h2>Open Campaigns</h2>
                <Link route="/campaigns/new">
                    <a>     
                    <Button
                        floated="right"
                        content="Create Campaign"
                        icon="add"
                        secondary= {true}  // adds blue color to it for the primary function it does
                    />
                    </a>
                </Link>
                {this.renderCampaigns()}
            </div>
        </Layout>
        );
    }

}

// whenever next imports a file from this directory, it is always going to expect that the file exports a react component
// thus we need to export the component from the file otherwise get an error

export default CampaignIndex;