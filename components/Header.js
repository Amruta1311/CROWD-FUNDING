import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

// anchor <a> tag is responsible for giving the right click functionality that helps us to open the link on the new page

export default () => {

    return (
        <Menu style={{ marginTop: '40px' }}>
            <Link route="/"><a className="item">CrowdCoin</a></Link>
            <Menu.Menu position="right">
            <Link route="/"><a className="item">Campaigns</a></Link>
            <Link route="/campaigns/new"><a className="item">+</a></Link>
            </Menu.Menu>
        </Menu>
    );

};
