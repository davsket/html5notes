// APLICACIÓN DE NOTAS
var APP = {}

APP.Storage = {}
APP.NOTES_LIST = 'notes_list'
APP.ACTUAL_NOTE = 'actual_note'

// LOCAL STORAGE

APP.Storage.set = function(key, value){
	if(typeof value == 'object'){
		localStorage[key] = JSON.stringify(value)
	}else{
		localStorage[key] = value
	}
}

APP.Storage.get = function(key){
	var val = localStorage[key]

	try{
		val = JSON.parse(val)
	}catch(e){}

	return val
}

// APLICACIÓN DEL LOCALSTORAGE

/**
 * Guarda una nota y crea una nueva si no se pasa id
 * @param {Object} obj objeto de la nota
 *        {String} id   opcional
 *        {String} name opcional si se pasa el id
 *        {String} text contenido de la nota
 * @return {String}      id de la nota
 */
APP.saveNote = function( note ){
	var list = APP.Storage.get(APP.NOTES_LIST)

	if( !list ){
		list = [note.id]
		APP.Storage.set(APP.NOTES_LIST, list)
	}
	
	if( !note.id ){
		note.id = 'note_' + new Date().getTime()
	}else if( !note.name ){
		note.name = APP.getNote( note.id ).name
	}

	APP.Storage.set(note.id, {name: note.name, text: note.text})

	return note.id
}

APP.getNote = function( id ){
	return APP.Storage.get(id)
}

APP.getAllNotes = function(){
	return APP.Storage.get(APP.NOTES_LIST) || []
}

APP.newNote = function(){
	var name = prompt('Nombre de la nota:'),
		id
	
	if( !name ) return
	
	id = APP.saveNote( {name: name} )
	
	APP.elems.selectNotes.append($('<option>', {
		'value': id,
		'text': name
	})).val(id)

	APP.notesList.push(id)

	APP.Storage.set(APP.NOTES_LIST, APP.notesList)

	APP.showNote( id )
}

APP.showNote = function( id ){
	var note = APP.getNote( id )

	if( note ){
		APP.elems.noteName.text( note.name )
		APP.elems.noteContent.html( note.text || '' )
		APP.actualNote = id
		APP.Storage.set(APP.ACTUAL_NOTE, id)
	}
}

APP.getUserMedia = function( callback, errcallback ) {
	// Require prefijos!!
  	var getUserMedia = 
  		navigator.getUserMedia ||
  		navigator.webkitGetUserMedia ||
  		navigator.mozGetUserMedia ||
  		navigator.msGetUserMedia

	if( getUserMedia ){
		getUserMedia.call(navigator, 
			{video: true},
			callback,
			errcallback
		)
	}else{
		alert('Tu navegador no permite captura de cámara, descarga Chrome')
	}
}

APP.initialize = function(){	
	APP.notesList = APP.getAllNotes()

	APP.elems = {}
	APP.elems.selectNotes = $('#notes')
	APP.elems.noteName = $('#note-name')
	APP.elems.noteContent = $('#note-content')
	APP.elems.buttonCamera = $('#capture-camera')
	APP.elems.cameraView = $('#camera-view')
	APP.elems.videoCanvas = $('#video-canvas')
	
	APP.showNote( APP.Storage.get(APP.ACTUAL_NOTE) )
	
	APP.notesList.forEach(function( key ){
		APP.elems.selectNotes.append($('<option>', {
			'value': key,
			'text': APP.getNote(key).name
		}))
	})

	// Events
	
	APP.elems.selectNotes.on('change', function(){
		var item = APP.elems.selectNotes.val(),
			note

		if(item === 'new'){
			APP.newNote()
		}else if( item != -1 ){
			APP.showNote( item )
		}
	})

	APP.elems.noteContent.on('keyup', function(){
		APP.saveNote({ id: APP.actualNote, text: this.innerHTML } )
	})

	APP.elems.buttonCamera.on('click', function(){
		if( APP.localMediaStream ){
			APP.snapshot()
		}else{
			APP.getUserMedia(function( localMediaStream ){
				var video = APP.elems.cameraView[0],
					interval

				APP.localMediaStream = localMediaStream
				video.src = window.URL.createObjectURL( APP.localMediaStream )
				
				APP.elems.videoCanvas[0].width = video.width
				APP.elems.videoCanvas[0].height = video.height
				
				interval = setInterval(function(){
					if( video.HAVE_ENOUGH_DATA ){
						clearInterval(interval)
							var width = video.videoWidth,
								height = video.videoHeight
							for(var i=0; i<4; i++){
								APP.elems.videoCanvas[0].width = width
								APP.elems.videoCanvas[0].height = height
							}
						APP.snapshot()
					}
				}, 100)
			}, function(){
				alert('Por favor permite que esta aplicación acceda a la cámara n_n')
			})	
		}
	})
}

APP.snapshot = function(){
	var img = document.createElement('img'),
		ctx = APP.elems.videoCanvas[0].getContext('2d')

	ctx.drawImage(APP.elems.cameraView[0], 0, 0)
	img.src = APP.elems.videoCanvas[0].toDataURL('image/webp')
	img.className = 'captured'

	APP.elems.noteContent.append(img)

	APP.saveNote({
		id: APP.actualNote,
		text: APP.elems.noteContent[0].innerHTML 
	})
}


APP.initialize()