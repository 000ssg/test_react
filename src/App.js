import React, { useState } from 'react';
import { useTable, useSortBy } from 'react-table'
import miniIcon from './1.png';
import editIcon from './edit.png';
import deleteIcon from './delete.png';
import './App.css';
import initialData from "./data.json"

var appTitle = "Nord Software"
// https://regex101.com/r/QXAhGV/1
const phoneCheck = new RegExp(/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/m);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: initialData,
      add: { id: "", name: "", email: "", phone: "" },
      modify: { id: "", name: "", email: "", phone: "" },
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

  /**
   * Participant entry validation
   * @param {*} obj 
   * @returns 
   */
  validateInput(obj) {
    var errors = {}
    if (!obj.name) { errors.name = "Cannot be empty" }
    if (!obj.email) { errors.email = "Cannot be empty" }
    else if (obj.email.indexOf("@") < 1) { errors.email = "Invalid e-mail address" }
    if (obj.phone) {
      if (!phoneCheck.test(obj.phone)) {
        errors.phone = "Invalid phone number"
      }
    }
    return errors;
  }

  /**
   * data persistence (TODO)
   */
  saveData() {
    console.log("Data updated, ready to save")
  }

  /**
   * Add new participant if valid entry and clean add/modify fields
   * @param {*} event 
   */
  handleAdd(event) {
    event.preventDefault();
    console.log("adding: " + event)
    var errors = this.validateInput(this.state.add)
    if (this.state.add && !(errors.name || errors.email || errors.phone)) {
      var newId = this.state.data
        .map(item => parseInt("" + item.id))
        .reduce((acc, val) => val > acc ? val : acc) + 1;

      this.setState({
        data: this.state.data.concat({
          id: "" + newId,
          name: this.state.add.name,
          email: this.state.add.email,
          phone: this.state.add.phone
        }),
        add: { name: "", email: "", phone: "" },
        modify: { id: "", name: "", email: "", phone: "" },
        addErrors: {}
      })
      this.saveData()
    } else {
      if (errors.name || errors.email || errors.phone) {
      } else { errors = {} }
      this.setState({
        addErrors: errors
      })
    }
  }

  handleSelect(event) {
    console.log("select: " + event.target.value)
    const mId = event.target.value
    const m = this.state.data.find(item => item.id === mId)
    if (m) {
      m.isEditing = true
    }
    this.setState({
      //data: this.state.data.map(item => item),
      modify: {
        id: m ? m.id : "",
        name: m ? m.name : "",
        email: m ? m.email : "",
        phone: m ? m.phone : ""
      },
    })
  }

  /**
   * Modify value for new (add) or modified entry's single attribute
   * @param {*} event 
   */
  handleChange(event) {
    event.preventDefault();
    console.log("change: " + event.target.name + ", " + event.target.value)
    switch (event.target.name) {
      case "newName":
        this.setState({
          add: {
            name: event.target.value,
            email: this.state.add.email,
            phone: this.state.add.phone
          }
        })
        break;
      case "newEmail":
        this.setState({
          add: {
            email: event.target.value,
            name: this.state.add.name,
            phone: this.state.add.phone
          }
        })
        break;
      case "newPhone":
        this.setState({
          add: {
            phone: event.target.value,
            email: this.state.add.email,
            name: this.state.add.name
          }
        })
        break;
      case "oldName":
        this.setState({
          modify: {
            id: this.state.modify.id,
            name: event.target.value,
            email: this.state.modify.email,
            phone: this.state.modify.phone
          }
        })
        break;
      case "oldEmail":
        this.setState({
          modify: {
            id: this.state.modify.id,
            email: event.target.value,
            name: this.state.modify.name,
            phone: this.state.modify.phone
          }
        })
        break;
      case "oldPhone":
        this.setState({
          modify: {
            id: this.state.modify.id,
            phone: event.target.value,
            email: this.state.modify.email,
            name: this.state.modify.name
          }
        })
        break;
    }
  }

  /**
   * Save changes for modified entry, if valid.
   * @param {*} event 
   */
  handleSave(event) {
    console.log("save: " + event.target.value)
    const mId = this.state.modify.id;
    const m = this.state.data.find(item => item.id === mId)

    var errors = this.validateInput(this.state.modify)

    if (!(errors.name || errors.email || errors.phone)) {
      if (m) {
        console.log("modified: " + mId)
        m.name = this.state.modify.name;
        m.email = this.state.modify.email;
        m.phone = this.state.modify.phone;
        m.isEditing = false;
      }

      this.setState({
        data: m ? this.state.data.slice(0,this.state.data.length) : this.state.data,
        modify: { id: "", name: "", email: "", phone: "" },
        modifyErrors: {}
      })
      this.saveData()
    } else {
      if (m) {
        if (errors.name || errors.email || errors.phone) {
        } else { errors = {} }
        this.setState({
          modifyErrors: errors
        })
      }
    }
  }

  /**
   * Cancel entry modification
   * @param {*} event 
   */
  handleCancel(event) {
    console.log("cancel: " + event.target.value)
    this.setState({
      modify: { id: "", name: "", email: "", phone: "" },
      modifyErrors: {}
    })
  }

  /**
   * Delete entry
   * @param {*} event 
   */
  handleDelete(event) {
    console.log("delete: " + event.target.value)
    const mId = event.target.value
    const m = this.state.data.find(item => item.id === mId)
    if (m) {
      var d = []
      this.state.data.forEach(element => {
        if (element.id === m.id) {
        } else d.push(element)
      });
    }
    this.setState({
      data: this.state.data.filter(a => mId != a.id),
      modify: { id: "", name: "", email: "", phone: "" },
      modifyErrors: {}
    })
    this.saveData()
  }

  render() {
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
            data={data}
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




function Table(props) {
  console.log("Table.render");
  const data = props.data;
  const modify = props.modify;
  const add = props.add;
  const modifyErrors = props.modifyErrors;
  const addErrors = props.addErrors;
  const handleChange = props.handleChange;
  const handleAdd = props.handleAdd;
  const handleSelect = props.handleSelect;
  const handleSave = props.handleSave;
  const handleCancel = props.handleCancel;
  const handleDelete = props.handleDelete;

  const columns = React.useMemo(
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

  const tableInstance = useTable({ columns, data, initialState: { hiddenColumns: ['id'] } }, useSortBy)
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
              <DrawEditCell name="newName" title="Full name"
                value={add.name} handler={handleChange} error={addErrors.name}
                tdStyle="TdAA" inputStyle="AInput"
              />
              <DrawEditCell name="newEmail" title="E-mail address"
                value={add.email} handler={handleChange} error={addErrors.email}
                tdStyle="TdAA" inputStyle="AInput"
              />
              <DrawEditCell name="newPhone" title="Phone number"
                value={add.phone} handler={handleChange} error={addErrors.phone}
                tdStyle="TdAA" inputStyle="AInput"
              />
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
                const isEditRow = modify && modify.id === row.values.id
                if (isEditRow) {
                  return (
                    <tr className="TrE" {...row.getRowProps()}>
                      <DrawEditCell name="oldName" title="Full name"
                        value={modify.name} handler={handleChange} error={modifyErrors.name}
                        tdStyle="TdE" inputStyle="EInput"
                      />
                      <DrawEditCell name="oldEmail" title="E-mail address"
                        value={modify.email} handler={handleChange} error={modifyErrors.email}
                        tdStyle="TdE" inputStyle="EInput"
                      />
                      <DrawEditCell name="oldPhone" title="Phone number"
                        value={modify.phone} handler={handleChange} error={modifyErrors.phone}
                        tdStyle="TdE" inputStyle="EInput"
                      />
                      <td className="TdA" valign="middle">
                        <div className="ACell">
                          <input type="button" className="ECButton" value="Cancel" onClick={handleCancel}></input>
                          <input type="button" className="ESButton" value="Save" onClick={handleSave}></input>
                        </div>
                      </td>
                    </tr>)
                } else
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
                          <button className="TdAEButton" onClick={handleSelect} value={row.values.id}><img src={editIcon} className="TdAIcon" alt="edit" /></button>
                          <button className="TdADButton" onClick={handleDelete} value={row.values.id}><img src={deleteIcon} className="TdAIcon" alt="delete" /></button>
                        </div>
                      </td>
                    </tr>
                  )
              })}
          </tbody>
        </table>        </div>
    </div>
  );
}

/**
 * name, title, value, handler, error, tdStyle, inputStyle
 * @param {*} props 
 * @returns 
 */
function DrawEditCell(props) {
  return (
    <td className={props.tdStyle}>
      <input className={props.inputStyle} name={props.name} size="12" placeholder={props.title} value={props.value} onChange={props.handler}></input>
      {props.error ? <span style={{ color: "red" }}><br />{props.error}</span> : ""}
    </td>
  )
}

export default App;
