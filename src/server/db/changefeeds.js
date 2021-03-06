/*
RethinkDB changefeed logic
*/
import {
	tables,
} from '../../config'
import {
	getUserObjectOnWallChange,
	handleUpdateUserInst,
} from './dataStructure'
import {
	getNewUserInstOnWallChange,
} from '../../logic'
var r = require('rethinkdb')
var actions = require('../../actions')

export const userChangefeeds = (socket) => {

	return function(rows) {
		rows.each(function(err, row) {
			if (err) {
				return console.log(err)
			}
			else if (row.new_val && !row.old_val) {	//	insert
				socket.emit('changefeed_' + actions.INSERT_OBJECT, row.new_val)
			}
			else if (row.new_val && row.old_val) {	//	edit
				socket.emit('changefeed_' + actions.EDIT_OBJECT, row.new_val)
			}
			else if (row.old_val && !row.new_val) {	//	delete
				socket.emit('changefeed_' + actions.DELETE_OBJECT, row.old_val)
			}
		})
	}
}

//	TODO: update walls with images
export const imageChangefeeds = (socket) => {

	return function(rows) {
		rows.each(function(err, row) {
			if (err) {
				return console.log(err)
			}
			else if (row.new_val && !row.old_val) {	//	insert
				console.log('image inserted')
				// socket.emit('imageToWall', row.new_val)
			}
			else if (row.new_val && row.old_val) {	//	edit
				// socket.emit('imageToWall', row.new_val)
			}
			else if (row.old_val && !row.new_val) {	//	delete
				// socket.emit('imageToWall', row.old_val)
			}
		})
	}
}

export const wallChangefeeds = (socket) => {

	return function(rows) {
		rows.each(function(err, row) {
			if (err) {
				return console.log(err)
			}
			else if (row.new_val && !row.old_val) {	//	insert
				updatedWallChange(row)
			}
			else if (row.new_val && row.old_val) {	//	edit
				updatedWallChange(row)
			}
			else if (row.old_val && !row.new_val) {	//	delete
				// socket.emit('imageToWall', row.old_val)
			}
		})
	}

}

const updatedWallChange = (row) => {
	const userID = row.new_val.climbers[0]
	const wallID = row.new_val.id
	getUserObjectOnWallChange(wallID, userID)
	.then(userObject => {
		const newUserInst = getNewUserInstOnWallChange(userObject, wallID)
		handleUpdateUserInst(newUserInst)
	})
}
