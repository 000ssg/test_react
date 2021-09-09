import React, {useState} from 'react';
import { useTable, useSortBy } from 'react-table'
import miniIcon from './1.png';
import editIcon from './edit.png';
import deleteIcon from './delete.png';
import './App.css';
import initialData from "./data.json"

var appTitle = "Nord Software"

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initialData,
              add: {id:"", name:"",email: "", phone:""},
              modify: {id:"", name:"",email: "", phone:""},
              addErrors: {},
              modifyErrors: {},
    }

    this.handleAdd = this.handleAdd.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  validateInput(obj) {
    var errors = {}
    if(!obj.name) { errors.name="Cannot be empty"}
    if(!obj.email) { errors.email="Cannot be empty"}
    else if(obj.email.indexOf("@")<1) { errors.email="Invalid e-mail address"}
    return errors;
  }

  saveData() {
    console.log("Data updated, ready to save")
  }

  handleAdd(event) {
    event.preventDefault();
    console.log("adding: "+event)
    var errors=this.validateInput(this.state.add)
    if(this.state.add && !(errors.name || errors.email || errors.phone)){
      var newId=this.state.data.map(item => parseInt(""+item.id)).reduce((acc,val) =>  val>acc?val:acc)+1;
      //this.state.data.push({id:""+newId,name:this.state.add.name,email:this.state.add.email,phone:this.state.add.phone});
      
      var d=this.state.data.map(item => item)
      d.push({id:""+newId,name:this.state.add.name,email:this.state.add.email,phone:this.state.add.phone});
      console.log("data: "+JSON.stringify(d))
      this.setState({
          data: d,
          add: {name:"",email: "", phone:""},
          modify: {id:"", name:"",email: "", phone:""},
          addErrors: {}
      })
      this.saveData()
    } else {
      if(errors.name || errors.email || errors.phone) {
      }else{errors={}}
      this.setState({
        addErrors: errors
    })
    }
  }

  handleSelect(event) {
    console.log("select: "+event.target.value)
    const mId=event.target.value
    const m=this.state.data.find(item => item.id===mId)
    this.setState({
        modify: {id:m?m.id:"", name:m?m.name:"",email: m?m.email:"", phone:m?m.phone:""},
    })
}

  handleChange(event) {
    event.preventDefault();
    console.log("change: "+ event.target.name+", "+ event.target.value)
    if("newName"===event.target.name) {
      this.setState({add: {name: event.target.value, email: this.state.add.email, phone: this.state.add.phone}})
    } else if("newEmail"===event.target.name) {
      this.setState({add: {email: event.target.value, name: this.state.add.name, phone: this.state.add.phone}})
    } else if("newPhone"===event.target.name) {
      this.setState({add: {phone: event.target.value, email: this.state.add.email, name: this.state.add.name}})
    } else if("oldName"===event.target.name) {
      this.setState({modify: {id: this.state.modify.id, name: event.target.value, email: this.state.modify.email, phone: this.state.modify.phone}})
    } else if("oldEmail"===event.target.name) {
      this.setState({modify: {id: this.state.modify.id, email: event.target.value, name: this.state.modify.name, phone: this.state.modify.phone}})
    } else if("oldPhone"===event.target.name) {
      this.setState({modify: {id: this.state.modify.id, phone: event.target.value, email: this.state.modify.email, name: this.state.modify.name}})
    }
  }

  handleSave(event) {
    console.log("save: "+event.target.value)
    const mId=this.state.modify.id;
    const m=this.state.data.find(item => item.id===mId)

    var errors=this.validateInput(this.state.modify)

    if(!(errors.name || errors.email || errors.phone)){
    if(m) {
    var d=[]
    this.state.data.forEach(element => {
      if(element.id===m.id) {
        console.log("modified: "+mId)
        d.push({id: this.state.modify.id, name:this.state.modify.name,email: this.state.modify.email, phone: this.state.modify.phone});
      }else d.push(element)
    });
  }
  console.log("data: "+JSON.stringify(d))
    this.setState({
      data: d,
      modify: {id:"", name:"",email: "", phone:""},
      modifyErrors: {}
    })
    this.saveData()
  }else {
     if(m) {
      if(errors.name || errors.email || errors.phone) {
      }else{errors={}}
      this.setState({
        modifyErrors: errors
    })
     }
  }
}

  handleCancel(event) {
    console.log("cancel: "+event.target.value)
    this.setState({
      modify: {id:"", name:"",email: "", phone:""},
    })
  }

  handleDelete(event) {
    console.log("delete: "+event.target.value)
    const mId=event.target.value
    const m=this.state.data.find(item => item.id===mId)
    if(m) {
    var d=[]
    this.state.data.forEach(element => {
      if(element.id===m.id) {
      }else d.push(element)
    });
  }
  console.log("data: "+JSON.stringify(d))
    this.setState({
      data: d,
      modify: {id:"", name:"",email: "", phone:""},
    })
    this.saveData()
  }

  dump(obj) {
    var s=typeof(obj);
    for(var i in obj) {
      s+="\n  "+i+": "+obj[i]
      if("target"===i) {
        s+="\n    "+this.dump(obj[i])
      }
    }
    return s;
  }

  render() {
    console.log("render data: "+JSON.stringify(this.state.data))
    console.log("render modify: "+JSON.stringify(this.state.modify))
    console.log("render add: "+JSON.stringify(this.state.add))
    const data = this.state.data;
    const modify = this.state.modify;
    const add = this.state.add;
    const modifyErrors = this.state.modifyErrors;
    const addErrors = this.state.addErrors;
    return (
    <div className="App">
      <header className="App-header">
        <img src={miniIcon} className="App-logo" alt="logo" /><div className="App-title">{appTitle}</div>
      </header>
      <div className="App-body">
        <Table 
      data={ data }
      modify={modify}
      add={add}
      addErrors={addErrors}
      modifyErrors={modifyErrors}
      handleChange={this.handleChange}
      handleAdd={this.handleAdd}
      handleSelect={this.handleSelect}
      handleDelete={this.handleDelete}
      handleSave={this.handleSave}
      handleCancel={this.handleCancel}
      />
      </div>
    </div>
  );
}
}




function Table (props) {
  console.log("Table.render");
  const data = props.data;
  const modify = props.modify;
  const add = props.add;
  const modifyErrors = props.modifyErrors;
  const addErrors = props.addErrors;
  const handleChange=props.handleChange;
  const handleAdd=props.handleAdd;
  const handleSelect=props.handleSelect;
  const handleSave=props.handleSave;
  const handleCancel=props.handleCancel;
  const handleDelete=props.handleDelete;

  const columns=React.useMemo(
    () => [
      {
        Header: 'Id',
        accessor: 'id', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'name', // accessor is the "key" in the data
      },
      {
        Header: 'E-Mail',
        accessor: 'email',
      },
      {
        Header: 'Phone number',
        accessor: 'phone',
      },
    ],
    []
  )

  const tableInstance = useTable({ columns, data, initialState: {hiddenColumns:[ 'id' ]} }, useSortBy)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = tableInstance


      return (
      <div className="Participants">
        <div className="Item-title">List of participants</div>
        <div className="Entries">
        
   <table className="Table" {...getTableProps()}>
     <thead>
     <tr className="TrA">
      <td className="TdAA">
        <input className="AInput" name="newName" size="12" placeholder="Full name" value={add.name} onChange={handleChange}></input>
        {addErrors.name ? <span style={{color: "red"}}><br/>{addErrors.name}</span> : ""}
        </td>
      <td className="TdAA">
        <input className="AInput" name="newEmail" size="12" placeholder="E-mail address" value={add.email} onChange={handleChange}></input>
        {addErrors.email ? <span style={{color: "red"}}><br/>{addErrors.email}</span> : ""}
        </td>
      <td className="TdAA">
        <input className="AInput" name="newPhone" size="12" placeholder="Phone number" value={add.phone} onChange={handleChange}></input>
        {addErrors.phone ? <span style={{color: "red"}}><br/>{addErrors.phone}</span> : ""}
        </td>
      <td className="TdAA" valign="middle">
        <div className="ACell">
          <input type="button" className="AButton" value="Add new" onClick={handleAdd}></input>
        </div>  
      </td>
     </tr>
       {// Loop over the header rows
       headerGroups.map(headerGroup => (
         // Apply the header row props
         <tr className="TrH" {...headerGroup.getHeaderGroupProps()}>
           {// Loop over the headers in each row
           headerGroup.headers.map(column => (
             // Apply the header cell props
             <th className="Th" {...column.getHeaderProps(column.getSortByToggleProps())}><div className="ThCell">
               {// Render the header
               column.render('Header')}
               <span>
               {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
               </span>
                </div>
             </th>
           ))}
           <th className="Th" >&nbsp;</th>
         </tr>
       ))}
     </thead>
     {/* Apply the table body props */}
     <tbody {...getTableBodyProps()}>
       {// Loop over the table rows
       rows.map(row => {
         // Prepare the row for display
         prepareRow(row)
         return (
           // Apply the row props
           <tr className="TrD" {...row.getRowProps()}>
             {// Loop over the rows cells
             row.cells.map(cell => {
               // Apply the cell props
               return (
                 <td className="TdD" {...cell.getCellProps()}><div className="TdCell">
                   {// Render the cell contents
                   cell.render('Cell')}</div>
                 </td>
               )
             })}
             <td className="TdA">
               <div className="IACell">
                 <button className="TdAButton" onClick={handleSelect} value={row.values.id}><img src={editIcon} className="TdAIcon" alt="edit" /></button>
                 <button className="TdAButton" onClick={handleDelete} value={row.values.id}><img src={deleteIcon} className="TdAIcon" alt="delete" /></button>
                 </div>
              </td>
           </tr>
         )
       })}
     <tr className="TrE">
      <td className="TdE">
        <input className="EInput" name="oldName" size="12" placeholder="Full name"  value={modify.name} onChange={handleChange}></input>
        {modifyErrors.name ? <span style={{color: "red"}}><br/>{modifyErrors.name}</span> : ""}
        </td>
      <td className="TdE">
        <input className="EInput" name="oldEmail" size="12" placeholder="E-mail address" value={modify.email} onChange={handleChange}></input>
        {modifyErrors.email ? <span style={{color: "red"}}><br/>{modifyErrors.email}</span> : ""}
        </td>
      <td className="TdE">
        <input className="EInput" name="oldPhone" size="12" placeholder="Phone number" value={modify.phone} onChange={handleChange}></input>
        {modifyErrors.phone ? <span style={{color: "red"}}><br/>{modifyErrors.phone}</span> : ""}
        </td>
      <td className="TdE" valign="middle">
      <div className="ACell">
      <input type="button" className="ECButton" value="Cancel" onClick={handleCancel}></input>
      <input type="button" className="ESButton" value="Save" onClick={handleSave}></input>
      </div>
      </td>
     </tr>
     </tbody>
   </table>        </div>
      </div>
    );
  }

export default App;
