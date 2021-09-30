import React from 'react';
import { useTable, useSortBy } from 'react-table'
import miniIcon from './1.png';
import editIcon from './edit.png';
import deleteIcon from './delete.png';
import './App.css';
import initialData from "./data.json"

const appTitle = "Nord Software"
// https://regex101.com/r/QXAhGV/1
const phoneCheck = new RegExp(/^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/m);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: initialData, // table data
      add: { name: "", email: "", phone: "" }, // new entry data
      addErrors: {}, // new entry errors
      modify: { id: "", name: "", email: "", phone: "" }, // editing entry data
      modifyErrors: {}, // editing entry errors
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
    let errors = {}

    // simulate empty if none
    if (!obj) obj = {}

    // check 
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
    console.debug("Data updated, ready to save")
  }

  /**
   * Add new participant if valid entry and clean add/modify fields
   * @param {*} event 
   */
  handleAdd(event) {
    console.debug("adding: " + event)
    event.preventDefault();
    let errors = this.validateInput(this.state.add)
    const hasError = errors.name || errors.email || errors.phone;
    if (this.state.add && !hasError) {
      // eval next id
      const newId = this.state.data
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
        addErrors: {},
      })
      this.saveData()
    } else {
      this.setState({
        addErrors: hasError ? errors : {}
      })
    }
  }

  /**
   * inline editing row selection: NO WARNING IF UNSAVED PREVIOUS ENTRY!!!
   * @param {*} event 
   */
  handleSelect(event) {
    console.debug("select: " + event.target.value)
    const mId = event.target.value
    const m = this.state.data.find(item => item.id === mId)
    if (m) {
      this.setState({
        modify: Object.assign({}, m),
        modifyErrors: {},
      })
    }
  }

  /**
   * Modify value for new (add) or modified entry's single attribute.
   * Expects target name in form: "<entry>:<field>[:<id>]" where entry is "add" or"modify".
   * @param {*} event 
   */
  handleChange(event) {
    console.debug("change: " + event.target.name + ", " + event.target.value)
    event.preventDefault();
    const [itemName, fieldName] = event.target.name.split(":");

    if (itemName && fieldName) {
      switch (itemName) {
        case "add":
        case "modify":
          const obj = Object.assign({}, this.state[itemName]);
          obj[fieldName] = event.target.value;
          this.setState({ [itemName]: obj })
          break;
      }
    }
  }

  /**
   * Save changes for modified entry, if valid.
   * Uses target name in form: "<action>:<id>" (to enable multi-row editing if desired)
   * @param {*} event 
   */
  handleSave(event) {
    console.debug("save: " + event.target.value + "/" + event.target.name)
    const [, mId] = event.target.name.split(":");
    const m = mId === this.state.modify.id
      ? this.state.data.find(item => item.id === mId)
      : null;

    let errors = this.validateInput(this.state.modify)
    const hasError = errors.name || errors.email || errors.phone;

    if (!hasError) {
      if (m) {
        console.debug("modified: " + mId)
        Object.assign(m, this.state.modify);

        this.setState({
          data: this.state.data.slice(),
          modify: { id: "", name: "", email: "", phone: "" },
          modifyErrors: {},
        })
        this.saveData()
      }
    } else {
      if (m) {
        this.setState({
          // data: this.state.data.slice(),
          modifyErrors: errors
        })
      }
    }
  }

  /**
   * Cancel entry modification
   * Uses target name in form: "<action>:<id>" (to enable multi-row editing if desired)
   * @param {*} event 
   */
  handleCancel(event) {
    console.debug("cancel: " + event.target.value + "/" + event.target.name)
    const [, itemId] = event.target.name.split(":");
    let m = mId === this.state.modify.id
      ? this.state.data.find(item => item.id === itemId)
      : null;

    if (m && this.state.modify.id === m.id) {
      this.setState({
        modify: { id: "", name: "", email: "", phone: "" },
        modifyErrors: {},
      })
    }
  }

  /**
   * Delete entry: entry id is in target.value.
   * @param {*} event 
   */
  handleDelete(event) {
    console.debug("delete: " + event.target.value)
    const mId = event.target.value
    this.setState({
      data: this.state.data.filter(a => mId !== a.id),
      modify: { id: "", name: "", email: "", phone: "" },
      modifyErrors: {},
    })
    this.saveData()
  }

  render() {
    const {
      data,
      add,
      addErrors,
      modify,
      modifyErrors
    } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <img src={miniIcon} className="App-logo" alt="logo" /><div className="App-title">{appTitle}</div>
        </header>
        <div className="App-body">
          <Table
            data={data}
            add={add}
            addErrors={addErrors}
            modify={modify}
            modifyErrors={modifyErrors}
            api={{
              add: this.handleAdd,
              select: this.handleSelect,
              delete: this.handleDelete,
              change: this.handleChange,
              save: this.handleSave,
              cancel: this.handleCancel,
            }}
          />
        </div>
      </div>
    );
  }
}

function Table(props) {
  console.debug("Table.render");

  const {
    data, // table data
    add, // new entry data
    addErrors, // new entry errors
    modify, // editing entry data
    modifyErrors, // editing entry errors
    api // data manipulation methods (handlers)
  } = props;

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
      {
        Header: 'edit',
        accessor: 'edit',
      },
    ],
    []
  );

  const initialState = { hiddenColumns: ['id', 'edit'] };

  const tableInstance = useTable({ columns, data, initialState, autoResetSortBy: false }, useSortBy);
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
              <DrawEditCell name="add:name" title="Full name"
                value={add.name} handler={api.change} error={addErrors.name}
                tdStyle="TdAA" inputStyle="AInput"
              />
              <DrawEditCell name="add:email" title="E-mail address"
                value={add.email} handler={api.change} error={addErrors.email}
                tdStyle="TdAA" inputStyle="AInput"
              />
              <DrawEditCell name="add:phone" title="Phone number"
                value={add.phone} handler={api.change} error={addErrors.phone}
                tdStyle="TdAA" inputStyle="AInput"
              />
              <td className="TdAA" valign="middle">
                <div className="ACell">
                  <input type="button" className="AButton" value="Add new" onClick={api.add}></input>
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
                return (<DrawTableRow
                  key={row.values.id}
                  row={row}
                  modify={modify}
                  modifyErrors={modifyErrors}
                  api={api}
                />)
              })}
          </tbody>
        </table>        </div>
    </div>
  );
}

function DrawTableRow(props) {
  let {
    row,
    api,
    modify,
    modifyErrors
  } = props;

  const isEditRow = modify && modify.id === row.values.id;
  //console.debug("TableRow.render: " + row.values.id+"/edit="+isEditRow);
  if (isEditRow) {
    return (
      <tr className="TrE" {...row.getRowProps()}>
        <DrawEditCell name={"modify:name:" + row.values.id} title="Full name"
          value={modify.name} handler={api.change} error={modifyErrors.name}
          tdStyle="TdE" inputStyle="EInput"
        />
        <DrawEditCell name={"modify:email:" + row.values.id} title="E-mail address"
          value={modify.email} handler={api.change} error={modifyErrors.email}
          tdStyle="TdE" inputStyle="EInput"
        />
        <DrawEditCell name={"modify:phone:" + row.values.id} title="Phone number"
          value={modify.phone} handler={api.change} error={modifyErrors.phone}
          tdStyle="TdE" inputStyle="EInput"
        />
        <td className="TdA" valign="middle">
          <div className="ACell">
            <input type="button" className="ECButton" name={"cancel:" + row.values.id} value="Cancel" onClick={api.cancel}></input>
            <input type="button" className="ESButton" name={"save:" + row.values.id} value="Save" onClick={api.save}></input>
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
            <button className="TdAEButton" onClick={api.select} value={row.values.id}><img src={editIcon} className="TdAIcon" alt="edit" /></button>
            <button className="TdADButton" onClick={api.delete} value={row.values.id}><img src={deleteIcon} className="TdAIcon" alt="delete" /></button>
          </div>
        </td>
      </tr>
    )
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
