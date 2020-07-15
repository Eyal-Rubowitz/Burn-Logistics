import React from 'react';
import { Meal } from '../models/mealModel';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import { Card, CardContent, Typography, 
         Box, List, ListItem, TextField, 
         FormControl, Select, MenuItem, 
         CardActions, IconButton, Grid } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            width: '100%',
        },
        hoverColor: {
            "&:hover": {
              backgroundColor: 'rgba(0,0,0,0.08)'
            }
          }
    }),
);

type MealProps = { meal: Meal };
const MealListItemComp = observer((props: MealProps) => {
    const classes = useStyles();
    let onHandleInputChange = (e: React.ChangeEvent<any>) => {
        let name: string = e.target.name;
        let value: string = e.target.value;
        (props.meal as any)[name] = value;
        props.meal.store.updateItem(props.meal);
    }

    let onDelete = (): void => {
        props.meal.isItemDeleted = true;
        props.meal.store.removeItem(props.meal);
    }

    let mealCategories: Set<string> = new Set(props.meal.store.items.map(m => m.name));
    let mealCategoryList: JSX.Element[] = Array.from(mealCategories).map((mc, i) => <MenuItem key={i} value={mc}>{mc}</MenuItem>)
    
    return (
        <Box my={1} key={props.meal._id}>
            <Card >
                <CardContent >
                    <FormControl className={classes.formControl}>
                        <TextField label='👨‍🍳'
                            name='chef'
                            onChange={onHandleInputChange}
                            value={props.meal.chef}
                            variant="outlined" />
                    </FormControl>
                    <div>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <Select value={props.meal.name} name='name' onChange={onHandleInputChange}>
                                {mealCategoryList}
                            </Select>
                        </FormControl>
                    </div>
                    <List dense={true}>
                        {props.meal.dishes.map(d => <ListItem key={d._id}>{d.name}</ListItem>)}
                    </List>
                </CardContent>
                <CardActions>
                    <Grid container direction="row" justify="flex-start" alignItems="flex-start">
                        <Grid item sm={9} style={{ marginLeft: '20px'}}>
                            <Link to={`/meals/${props.meal._id}`}
                                style={{ textDecoration: 'none', color: '#3f51b5'  }}>
                                <Typography variant="h6" >
                                    Edit Meal
                                </Typography>
                            </Link>
                        </Grid>
                        <Grid item sm={1}>
                            <IconButton onClick={onDelete} color="secondary" size="medium" className={classes.hoverColor}>
                                <DeleteForeverIcon fontSize="large" color='secondary' enableBackground="red"></DeleteForeverIcon>
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </Box>
    );
})

export default MealListItemComp;