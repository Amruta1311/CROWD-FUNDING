import React, { Component } from 'react';

import { Button, Table } from 'semantic-ui-react';

import { Link } from '../../../routes';

import Layout from '../../../components/Layout';

import Campaign from '../../../ethereum/campaign';

import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props) {       //To get access to the address out of the URL and pass it into our components as props
        const { address } = props.query;

        const campaign = Campaign(address);

        const requestCount = await campaign.methods.getRequestsCount().call();

        const approversCount = await campaign.methods.approversCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount))
            .fill()
            .map((element, index) => {
                return campaign.methods.requests(index).call()  //Request method retrieves a given individual request
            })
        );

     //   console.log(requests);

        return { address, requests, requestCount, approversCount };
    }

    renderRow() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                    key = {index}
                    id = {index}
                    request = {request}
                    address = {this.props.address}
                    approversCount={this.props.approversCount}
                    />;
        });
    }


    render() {

        const { Header, Row, HeaderCell,Body }= Table;

        return (
            <Layout>
                <h3>Requests List</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button secondary floated="right" style = {{marginBottom: 20}}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {this.renderRow()}
                    </Body>
                </Table>
                <div>Found {this.props.requestCount} Requests!</div>
            </Layout>
        );
    }
}

export default RequestIndex;