import React, { PureComponent, forwardRef } from 'react';
import { AppRootModel } from '../../modelsContext';
import MaterialTable from 'material-table';
import { KitchenTool } from '../../models/kitchenToolsModel';
import { observer } from 'mobx-react';
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import './kitchenToolsStyle.scss';
import { IconButton } from '@material-ui/core';

const KitchenToolTag = observer((props: { kt: KitchenTool, attr: any }) =>
    <span>{(props.kt as any)[props.attr]}</span>
)

@observer
export default class KitchenToolsComp extends PureComponent<KitchenTool>{

    render() {
        return (
            <div id="kitchenDiv">
                <MaterialTable
                    title='Kitchen Tools'
                    style={{ width: '45%' }}
                    icons={{
                    Add: forwardRef((props, ref) => <div className="addKitchenDiv">
                                                        <AddIcon className="icon" 
                                                                {...props} 
                                                                ref={ref} 
                                                                color="primary" 
                                                                fontSize="default" 
                                                                viewBox="0 0 20 20" />
                                                            <p className="p">Add Kitchen Item</p>
                                                    </div>),
                        Delete: forwardRef((props, ref) => <IconButton size="medium" className="hoverAlertColor" >
                                                                <DeleteForeverIcon {...props} ref={ref} color="secondary" />
                                                           </IconButton>)
                    }}
                    columns={[
                        {
                            title: 'Item',
                            field: 'kitchenItem',
                            render: (kt) => <KitchenToolTag kt={kt} attr="kitchenItem" />,
                            type: "string"
                        },
                        {
                            title: 'Quantity',
                            field: 'quantity',
                            render: (kt) => <KitchenToolTag kt={kt} attr="quantity" />,
                            type: "numeric"
                        },
                        {
                            title: 'Category',
                            field: 'category',
                            render: (kt) => <KitchenToolTag kt={kt} attr="category" />,
                            type: "string"                       
                        },
                    ]}
                    data={AppRootModel.kitchenToolsModel.items.map(kt => kt)}
                    options={{
                        addRowPosition: 'first',
                        pageSize: AppRootModel.kitchenToolsModel.items.length,
                        paging: false,
                        headerStyle: { position: 'sticky', top: 0 },
                        maxBodyHeight: '800px',
                        actionsColumnIndex: -1,
                        search: false
                    }}
                    editable={{
                        onRowAdd: (newKT: KitchenTool): Promise<void> => {
                            return new Promise((res) => {
                                AppRootModel.kitchenToolsModel.createItem(newKT);
                                res();
                            })
                        },
                        onRowUpdate: (newKT: KitchenTool, oldKT?: KitchenTool) => {
                            return new Promise((res, rej) => {
                                if (oldKT) oldKT.store.updateItem(newKT);
                                res();
                            })
                        },
                        onRowDelete: (oldKT: KitchenTool) => {
                            return new Promise((res, rej) => {
                                oldKT.isItemDeleted = true;
                                oldKT.store.removeItem(oldKT);
                                res();
                            })
                        }
                    }} />
            </div>
        )
    }
}