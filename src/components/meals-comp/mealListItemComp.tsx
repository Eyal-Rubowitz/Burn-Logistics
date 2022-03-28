import React from 'react';
import { Meal } from '../../models/mealModel';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Card, CardContent, Typography, 
         Box, List, ListItem, 
         FormControl, Select, MenuItem, 
         CardActions, IconButton, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import './meals-style/mealListItemStyle.scss';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            width: '100%',
        },
        hoverColor: {
            "&:hover": {
            //   backgroundColor: 'rgba(0,0,0,0.08)'
            }
          }
    }),
);

type IMealProps = { meal: Meal };
const MealListItemComp = observer((props: IMealProps) => {
    const classes = useStyles();
    let onHandleInputChange = (e: React.ChangeEvent<any>) => {
        let elementAttrName: string = e.target.name;
        let value: string = e.target.value;
        (props.meal as any)[elementAttrName] = value;
        props.meal.store.updateItem(props.meal);
    }

    let onDelete = (): void => {
        props.meal.isObjDeleted = true;
        props.meal.store.removeItem(props.meal);
    }

    let mealCategories: Set<string> = new Set(props.meal.store.objectList.map(m => m.categoryType));
    console.log('props.meal.store: ', props.meal.store)
    let mealCategoryList: JSX.Element[] = Array.from(mealCategories).map((mc, i) => <MenuItem key={i} value={mc}>{mc}</MenuItem>)
    // let chefsSet: Set<string> = new Set(props.meal.store.objectList.map(m => m.categoryType));
    let members: Record<string, string> = props.meal.memberListData;
    let memberList: JSX.Element[] = Object.keys(members).map((mmbrId) => <MenuItem key={mmbrId} value={mmbrId}>{(props.meal.chefId === mmbrId) ? members[mmbrId] +  " 👨‍🍳" : "" + members[mmbrId]}</MenuItem>)

    return (
        <Box my={1} key={props.meal._id} className="grow">
            <Card >
                <CardContent >
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Select value={props.meal.chefId} name='chefId' onChange={onHandleInputChange}>
                                {memberList}
                            </Select>
                        </FormControl>
                    <div>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Select value={props.meal.categoryType} name='categoryType' onChange={onHandleInputChange}>
                                {mealCategoryList}
                            </Select>
                        </FormControl>
                    </div>
                    <List dense={true}>
                        {props.meal.dishes.map(d => <ListItem key={d._id}>{d.name}</ListItem>)}
                    </List>
                </CardContent>
                <CardActions>
                    <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start">
                        <Grid item sm={9} className="grd">
                            <Link to={`/meals/${props.meal._id}`}
                                className="link">
                                <Typography variant="h6" >
                                    Edit Meal
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid item sm={1}>
                            <IconButton onClick={onDelete} className="hoverAlertColor" size="medium" >
                                <DeleteForeverIcon fontSize="large" color='secondary'></DeleteForeverIcon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Box>
    );
})

export default MealListItemComp;