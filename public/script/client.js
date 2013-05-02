'use strict';

function Todo( rawTodo ) {
	var self = this;
	self.svc = new service();

	self.description = ko.observable( rawTodo.description );
	self.type = ko.observable( rawTodo.type );
	self.dirty = ko.observable( false );
	self._id = rawTodo._id;

	self.description.subscribe( function() {
		self.dirty( true );
	});

	self.type.subscribe( function() {
		self.dirty( true );
	});



	self.saveTodo = function () {
		if(self._id) {
			self.svc.update( { description: self.description(), type: self.type(), _id: self._id }, function ( resp ) {
				self.dirty( false );
			} );
		}
		else {
			self.svc.create( { description: self.description(), type: self.type() }, function ( resp ) {
				console.log( JSON.stringify( resp ) );
				self.dirty( false );
			});
		}
	}
}

function Atodos() {
	var self = this;
	self.svc = new service();
	self.TodoList = ko.observableArray();

	self.deleteTodo = function (target) {
		self.svc.delete( target._id, function ( resp ) {
			self.TodoList.remove( target );
		} );
	};

	(function( ) {
		self.svc.getTodos( function (data) {
			for ( var i = 0; i < data.length; i++ ) {
				data[i] = new Todo( data[i] );
			}
			self.TodoList( data );
			self.TodoList.push( new Todo( { description: '', type: '', _id: null } ) );
		});

	})( );
}

function service() {
	var self = this;

	self.getTodos = function ( callback ) {
		$.get('/api/todos', function ( todos ) {
			callback( todos );
		})
	};

	self.create = function ( todo, callback ) {
		$.post( '/api/todos', todo ).done( function ( resp ) {
			callback( resp );
		});
	};

	self.update = function ( todo, callback ) {
		debugger;
		$.ajax({
  			url: '/api/todos/' + todo._id,
  			type: 'PUT',
  			data: todo,
  			success: function( resp ) {
  				callback( resp );
  			}
  		});
	};

	self.delete = function ( id, callback ) {
		$.ajax({
  			url: '/api/todos/' + id,
  			type: 'DELETE',
  			success: function( resp ) {
  				callback( resp );
  			}
  		});
	};
};

