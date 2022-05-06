import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { 
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Grid,
    Typography,
    TablePagination,
    TableFooter
 } from '@material-ui/core';

 const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
      borderRadius: 15,
      
  },
  tableHeaderCell: {
      fontWeight: 'bold',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.getContrastText(theme.palette.primary.dark)
  },
  avatar: {
    width: 50
  },
  name: {
      fontWeight: 'bold',
      color: theme.palette.secondary.dark
  },
  status: {
      fontWeight: 'bold',
      fontSize: '0.75rem',
      color: 'white',
      backgroundColor: 'grey',
      borderRadius: 8,
      padding: '3px 10px',
      display: 'inline-block'
  },
  khung: {
    margin: '10px auto',
    maxWidth: 1050,
  }
}));


function UsersTable(props) {
  const classes = useStyles();

  return (
    <div className={classes.khung}>
      <p className="title_table title_table_users">Users</p>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className={classes.tableHeaderCell}>Info user</TableCell>
              <TableCell className={classes.tableHeaderCell}>Email</TableCell>
              <TableCell className={classes.tableHeaderCell}>Admin / User</TableCell>
              <TableCell className={classes.tableHeaderCell}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.listUsers.map((user) =>{
              return (
                <TableRow key={user.id}>
                <TableCell>
                    <Grid container>
                        <Grid item lg={2}>
                            <Avatar alt="" src='.' className={classes.avatar}/>
                        </Grid>
                        <Grid item lg={10}>
                            <Typography className={classes.name}>{user.userAddress}</Typography>
                        </Grid>
                    </Grid>
                  </TableCell>
                <TableCell>
                    <Typography color="textSecondary" variant="subtitle2">{user.email}</Typography>
                  </TableCell>
                <TableCell>{
                  user.isAdmin? "Admin" : "User"
                }</TableCell>
                <TableCell>
                    <Typography 
                      className={classes.status}
                      style={{
                          backgroundColor: (user.status ? 'green' : 'orange')
                      }}
                    >{user.status ? "Online" : "Offline"}</Typography>
                  </TableCell>
              </TableRow>
              )
            })}
              
          </TableBody>
        </Table>
      </TableContainer>
    </div>
    
  );
}

export default UsersTable;