import React, { PureComponent } from 'react';
import { AppRootModel } from '../modelsContext';
import MaterialTable from 'material-table';
import { KitchenTool } from '../models/kitchenToolsModel';
import { observer } from 'mobx-react';

const KitchenToolTag = observer((props: { kt: KitchenTool, attr: any }) =>
    <span>{(props.kt as any)[props.attr]}</span>
)

@observer
export default class KitchenToolsComp extends PureComponent<KitchenTool>{

    render() {
        return (
            <div style={{ display: 'flex', marginLeft: '1%' }}>
                <MaterialTable
                    style={{ width: '40%' }}
                    title='Kitchen Tools'
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
                        maxBodyHeight: '550px',
                        actionsColumnIndex: -1
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
                    }}
                />
            </div>
        )
    }
}