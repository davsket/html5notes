# Presentacion CParty6

## LocalStorage

Local storage permite almacenar en el navegador del usuario información en formato de texto, si guardas un: número, objeto, arreglo, etc., este va a forzarlo a texto, por lo que probablemente dependiendo de lo que quieras hacer tendrás que pasarlo a JSON antes de guardarlo.

Funciona por dominio y subdominio, si lo usas sobre wwww va a ser diferente que en la raíz del dominio.

Escritura:

```
localStorage[key] = value
localStorage.setItem(key, value)
```

Lectura:
```
localStorage[key] // value
localStorage.getItem(key) // value
```

Interacción con JSON:
```
localStorage['test'] = {a:3}
>> "[object Object]"
localStorage['test'] = JSON.stringify({a:3}) // '{"a":3}'
>> '{"a":3}'
JSON.parse(localStorage['test'])
>> {a:3}
```

Extender
```
var Store = {}

Store.set = function(key, value){
	if(typeof value == 'object'){
		localStorage[key] = JSON.stringify(value)
	}else{
		localStorage[key] = value
	}
}

Store.get = function(key){
	var val = localStorage[key]
	try{
		val = JSON.parse(val)
	}catch(e){}
	return val
}
```

