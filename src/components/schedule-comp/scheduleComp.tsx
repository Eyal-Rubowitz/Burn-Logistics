import React, { PureComponent } from "react";
import { Meal } from '../../models/mealModel';
import { observer } from "mobx-react";
import { AppRootModel } from "../../modelsContext";
import { Table, Checkbox } from "@material-ui/core";
import { observable } from "mobx";
import './scheduleStyle.scss';

@observer
class ScheduleTableComp extends PureComponent {

    @observable mealInfoToShow?: Meal = undefined;
    dividerDate: Date = new Date(1970);

    onShowMealInfo(m: Meal): void {
        this.mealInfoToShow = (this.mealInfoToShow === m) ? undefined : m;
    }

    @observable ScheduleTableFunc = ((mealList: Meal[]): JSX.Element => {
        let scheduleTable: JSX.Element[] = mealList.slice().sort((a, b) => a.date.getTime() - b.date.getTime()).map((m, i) => {
            let borderBool: boolean = (this.dividerDate.toLocaleDateString() !== m.date.toLocaleDateString() && i !== 0);
            this.dividerDate = m.date;

            let sousChefNames: JSX.Element[] = m.sousChefList.map(name => {
                return (
                    <div key={name} className="sousName">{name}</div>
                )
            })

            let cleaningCrewNames: JSX.Element[] = m.cleaningCrewList.map(name => {
                return (
                    <div key={name}  className="cleanName">{name}</div>
                )
            })

            return (
                <tr key={i} className="tableTr" 
                            style={{ backgroundColor: (i % 2 === 0) ? "#FFF5EE" : "#F0F8FF", 
                                     borderTop: (borderBool) ? 'solid 5px black' : 'none' }}>
                    <td>{m.chef}</td>
                    <td>{m.date.toLocaleDateString()}</td>
                    <td>{m.name}</td>
                    <td className="servingTd">{m.serving.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                        <Checkbox
                            className="checkBox"
                            color="primary"
                            name={`${m._id} info`}
                            checked={((this.mealInfoToShow && this.mealInfoToShow._id === m._id) || false)}
                            onChange={() => this.onShowMealInfo(m)}
                        />
                    </td>
                    <td>
                        {sousChefNames}
                    </td>
                    <td>
                        {cleaningCrewNames}
                    </td>
                </tr>
            )
        });

        return (
            <Table id="mealScheduleTable">
                <thead id="head" >
                    <tr id="headTr">
                        <th>Chef</th><th id="headTh">Date</th><th>Meal</th><th>Serving Time</th><th>Meal Info</th><th>Sous Chefs</th><th id="headThClean">Cleaning Crew</th>
                    </tr>
                </thead>
                <tbody>
                    {scheduleTable}
                </tbody>
            </Table>
        )
    });

    MealTableFunc = ((meal: Meal): JSX.Element => {
        let mealDishesNameHeaders: JSX.Element[] = meal.dishes.map((d, i) => {
            return (
                <th key={d.name}
                    className="dishNameInfoTh"
                    style={{ borderLeft: (i !== 0) ? 'solid 3px black' : 'none' }}>
                    {d.name}
                </th>
            )
        })

        let mealDishesIngInfo: JSX.Element[] = meal.dishes.map((d, i) => {
            return (
                <td key={d.name}
                    className="dishInfo"
                    style={{ borderLeft: (i !== 0) ? 'solid 3px black' : 'none' }}>
                    {d.ingrediants.map((ing, j) => {
                        return <ul key={j} className="dishIng" style={{ backgroundColor: (j % 2 === 0) ? '#FFFFFF' : '#dbdbdb' }}>{ing.name}</ul>
                    })}
                </td>
            )
        })

        return (
            <Table id="scheduleTable">
                <thead id="tableHead">
                    <tr>
                        {mealDishesNameHeaders}
                    </tr>
                </thead>
                <tbody id="tableBody">
                    {mealDishesIngInfo}
                </tbody>
            </Table>
        )
    })

    render() {
        return (
            <div>
                {this.ScheduleTableFunc(AppRootModel.mealModel.items)}
                {(this.mealInfoToShow) ? this.MealTableFunc(this.mealInfoToShow) : ''}
            </div>
        )
    }
}

export default ScheduleTableComp;