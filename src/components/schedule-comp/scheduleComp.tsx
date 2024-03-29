import React, { Component } from "react";
import { Meal } from "../../models/mealModel";
import { observer } from "mobx-react";
import { AppRootModelsContext } from "../../App";
import { Table, Checkbox } from "@material-ui/core";
import { observable, IReactionDisposer, autorun } from "mobx";
import "./scheduleStyle.scss";

@observer
class ScheduleTableComp extends Component {
  disposeAutorun: IReactionDisposer;

  @observable mealInfoToShow?: Meal = undefined;
  @observable activatedTr: Boolean[] = [];
  dividerDate: Date = new Date(1970);

  constructor(props: {}) {
    super(props);
    this.disposeAutorun = autorun(() => {
      this.activatedTr = AppRootModelsContext.mealModel.objectList.map(
        (m) => false
      );
    });
  }

  componentWillUnmount(): void {
    this.disposeAutorun();
  }

  onShowMealInfo(m: Meal): void {
    this.mealInfoToShow = this.mealInfoToShow === m ? undefined : m;
  }

  onActiveTr(i: number): void {
    const isActivated = (el: Boolean) => el === true;
    const activeIndex = this.activatedTr.findIndex(isActivated);
    this.activatedTr = this.activatedTr.map((bool, index) =>
      i === index && activeIndex !== i ? true : false
    );
  }

  @observable ScheduleTableFunc = (mealList: Meal[]): JSX.Element => {
    let scheduleTable: JSX.Element[] = mealList
      .slice()
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .map((m, i) => {
        let borderBool: boolean =
          this.dividerDate.toLocaleDateString() !==
            m.date.toLocaleDateString() && i !== 0;
        this.dividerDate = m.date;

        let members: Record<string, string> = m.memberListData;

        let sousChefIdList: JSX.Element[] = m.sousChefIdList.map((suChefId) => {
          return (
            <div
              key={suChefId}
              className={`sousName name ${
                m.isConnectedUser(suChefId) ? "bringOutUserName" : ""
              }`}
            >
              {members[suChefId]}
            </div>
          );
        });

        let cleaningCrewIdList: JSX.Element[] = m.cleaningCrewIdList.map(
          (cleanerId) => {
            return (
              <div
                key={cleanerId}
                className={`cleanName name ${
                  m.isConnectedUser(cleanerId) ? "bringOutUserName" : ""
                }`}
              >
                {members[cleanerId]}
              </div>
            );
          }
        );

        return (
          <tr
            key={i}
            onClick={() => this.onActiveTr(i)}
            className={`tableTr 
                                ${i % 2 === 0 ? "evn" : "odd"} 
                                ${borderBool ? "borderDays" : "none"}
                                ${this.activatedTr[i] ? "trActive" : ""}
                                
                                `}
          >
            <td
              className={`${
                m.isConnectedUser(m.chefId) ? "bringOutUserName" : ""
              }`}
            >
              {m.chefName}
            </td>
            <td>{m.date.toLocaleDateString()}</td>
            <td>{m.categoryType} </td>
            <td className="servingTd">
              {m.serving.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </td>
            <td>
              <Checkbox
                className="checkBox"
                color="primary"
                name={`${m._id} info`}
                checked={
                  (this.mealInfoToShow && this.mealInfoToShow._id === m._id) ||
                  false
                }
                onChange={() => this.onShowMealInfo(m)}
              />
            </td>
            <td>{sousChefIdList}</td>
            <td>{cleaningCrewIdList}</td>
          </tr>
        );
      });

    return (
      <Table id="mealScheduleTable">
        <thead id="head">
          <tr id="headTr">
            <th>Chef</th>
            <th id="headTh">Date</th>
            <th>Meal</th>
            <th>Serving Time</th>
            <th>Meal Info</th>
            <th>Sous Chefs</th>
            <th id="headThClean">Cleaning Crew</th>
          </tr>
        </thead>
        <tbody>{scheduleTable}</tbody>
      </Table>
    );
  };

  MealTableFunc = (meal: Meal): JSX.Element => {
    let mealDishesNameHeaders: JSX.Element[] = meal.dishes.map((d, i) => {
      return (
        <th
          key={d.name}
          className={`dishNameInfoTh ${i !== 0 ? "borderInfo" : ""}`}
        >
          {d.name}
        </th>
      );
    });

    let mealDishesIngInfo: JSX.Element[] = meal.dishes.map((d, i) => {
      return (
        <td key={d.name} className={`dishInfo ${i !== 0 ? "borderInfo" : ""}`}>
          {d.ingredients.map((ing, j) => {
            return (
              <ul
                key={j}
                className={`dishIng ${j % 2 === 0 ? "evnInfo" : "oddInfo"}`}
              >
                {ing.name}
              </ul>
            );
          })}
        </td>
      );
    });

    return (
      <Table id="mealInfoTable">
        <thead id="infoTableHead">
          <tr>{mealDishesNameHeaders}</tr>
        </thead>
        <tbody id="infoTableBody">{mealDishesIngInfo}</tbody>
      </Table>
    );
  };

  render() {
    return (
      <div>
        {this.ScheduleTableFunc(AppRootModelsContext.mealModel.objectList)}
        {this.mealInfoToShow ? this.MealTableFunc(this.mealInfoToShow) : ""}
      </div>
    );
  }
}

export default ScheduleTableComp;
