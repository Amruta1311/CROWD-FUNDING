import react, { Component } from 'react';

import { Card } from 'semantic-ui-react';

import Layout from '../../components/Layout';

import Campaign from '../../ethereum/campaign';

import web3 from '../../ethereum/web3';

import ContributeForm from '../../components/ContributeForm';

import { Grid, Button } from 'semantic-ui-react';

import { Link } from '../../routes';


class CampaignShow extends Component {

    static async getInitialProps(props) {

        const campaign = Campaign(props.query.address);    //Contains the actual address of the campaign we are showing to the user

        const summary = await campaign.methods.getSummary().call();

        return {
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        };

    }

    renderCards() {

        const {
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;     //destructuring

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }   // Causes the really long address to break into two and wrap down to the line underneath it.
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by the approvers'
            },
            {
                header: approversCount,
                meta: 'Number of Aprovers',
                description: 'Number of people who have already donated to this campaign.'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend.'
            }

        ];

        return <Card.Group items = {items} />;
    }


    render()
    {
        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={6}>               
                            <ContributeForm address={this.props.address} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.address}/requests`}>
                                <a>
                                    <Button secondary>View Requests</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;