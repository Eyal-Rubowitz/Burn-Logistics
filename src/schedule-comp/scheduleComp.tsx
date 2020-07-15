import React, { PureComponent } from "react";
import { Meal } from '../models/mealModel';
import { observer } from "mobx-react";
import { AppRootModel } from "../modelsContext";
import { Table, Checkbox } from "@material-ui/core";
import { observable } from "mobx";

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
                    <div key={name} style={{ whiteSpace: 'nowrap', width: '125px', display: 'inline-block' }}>{name}</div>
                )
            })

            let cleaningCrewNames: JSX.Element[] = m.cleaningCrewList.map(name => {
                return (
                    <div key={name} style={{ lineHeight: '270%', whiteSpace: 'nowrap', width: '125px', display: 'inline-block', backgroundColor: 'darkGreen', color: 'lightGreen' }}>{name}</div>
                )
            })

            return (
                <tr key={i} style={{ lineHeight: 'auto', borderBottom: '1px solid black', backgroundColor: (i % 2 === 0) ? "#FFF5EE" : "#F0F8FF", borderTop: (borderBool) ? 'solid 5px black' : 'none' }}>
                    <td>{m.chef}</td>
                    <td>{m.date.toLocaleDateString()}</td>
                    <td>{m.name}</td>
                    <td style={{ textIndent: '20px' }}>{m.serving.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td>
                        <Checkbox
                            style={{ transform: 'scale(1.2)' }}
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
            <Table id="mealScheduleTable" style={{ border: 'solid 1px black', textAlign: "left", whiteSpace: 'nowrap' }}>
                <thead style={{ backgroundColor: '#3f51b5', color: '#00FFFF', width: 'auto' }}>
                    <tr style={{ whiteSpace: 'nowrap', fontSize: '24px', lineHeight: '35px'}}>
                        <th>Chef</th><th style={{ width: 'auto'}}>Date</th><th>Meal</th><th>Serving Time</th><th>Meal Info</th><th>Sous Chefs</th><th style={{ backgroundColor: 'darkGreen', color: 'lightGreen' }}>Cleaning Crew</th>
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
                    style={{
                        textAlign: 'center',
                        borderLeft: (i !== 0) ? 'solid 3px black' : 'none',
                        minWidth: '220px',
                        maxWidth: 'auto',
                        display: 'blick'
                    }}>
                    {d.name}
                </th>
            )
        })

        let mealDishesIngInfo: JSX.Element[] = meal.dishes.map((d, i) => {
            return (
                <td key={d.name}
                    style={{
                        textAlign: 'left',
                        verticalAlign: 'text-top',
                        borderLeft: (i !== 0) ? 'solid 3px black' : 'none',
                        minWidth: '220px',
                        maxWidth: 'auto',
                        display: 'blick'
                    }}>
                    {d.ingrediants.map((ing, j) => {
                        return <ul key={j} style={{ margin: 0, height: '26px', backgroundColor: (j % 2 === 0) ? '#FFFFFF' : '#dbdbdb' }}>{ing.name}</ul>
                    })}
                </td>
            )
        })

        return (
            <Table id="mealInfo" style={{ marginTop: '20px', border: 'solid 1px black', textAlign: "left", width: "auto" }}>
                <thead style={{ display: 'block', backgroundColor: '#3f51b5', color: '#00FFFF' }}>
                    <tr>
                        {mealDishesNameHeaders}
                    </tr>
                </thead>
                <tbody style={{ display: 'block' }}>
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