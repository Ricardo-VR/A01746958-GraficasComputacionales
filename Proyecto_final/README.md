# Propuestas proyecto final Gráficas Computacionales #
- - - -
## Propuesta 1: * ##
Figura/estatua de uno o más personajes. Los personajes se mantendrán inmóviles. La cámara se podrá mover de manera libre como el usuario quiera. La cámara podrá moverse entre los espacios que las figuras no ocupen. Los personajes van a tener efectos de luz.

## Requerimientos ##
### Requerimientos Objetos ###
* Usuario podra elegir un personaje y podra agregarlo a la escena (De ser posible arrastrar del menú).
* Usuario puede quitar de la escena un personaje a la vez.
* Usuario puede quitar todo los personajes con un boton.
* Usuario podra agregar un personaje aleatorio con un boton.
* Podran existir hasta un total de 5 personajes en la escena.
* Usuario pudra elegir a un personaje en la escena y podra cambiar entre los dos estados.
* Usuario puede cambiar el estado de todos los personajes en la escena al estado congelado con un boton. Solo los personajes animados tienen que cambiar a congelado.
* Usuario puede cambiar el estado de todos los personajes en la escena al estado animado con un boton. Solo los personajes congelados tienen que cambiar a animado.

### Requerimientos Escenas ###
* Usuario podra elegir la escena en donde poner al personaje.
* El usuario podra elegir la variante del escenario.
* El usuario podra cambiar la escena de manera aleatoria.

### Requrimientos cámara ###
* La cámara se puede mover dentro de la escena.
* Girar la camara cuando este alejado.
* Colisión entre cámara y figuras.

### Requerimientos interfaz ###
* Menú para elegir personajes.
* Boton para agregar personaje aleatorio.
* Menú para cambiar estado del personaje. Solo cuando se elige un solo personaje. Se debe ocultar al dar click en la escena.
* Menú para elegir escenario.
* Sub menú para elegir varainte de escenario.
* Boton para elegir escena de manera aleatoria.
* (Opcional) Exportar escenas en JSON.
* (Opcional) Importar escenas de JSON.

## Objetos ##
* Importar todo los objetos y probarlos
* Todos los assets
- Importar los objetos
- 5 a 7 personajes.
- 2 a 5 animaciones por personaje.
- Cada personaje tendra dos estados
    - Animado: Se rotaran todas la animaciones que cada personaje tenga disponible. Solo se dentra de mover cuando se le indique.
    - Congelado: Se mantiene en la última posición.
- Los personajes no podran salir de la escena.

### Lista de objetos ###
Utilizar Blender para combinar diferentes animaciones con los personajes de mixamo.
https://www.mixamo.com/#/?page=1&type=Character
https://www.youtube.com/watch?v=a7Gj9w70bPA

## Escenarios ##
- 4 a 5 escenarios.
- 2 a 3 variantes por cada escenario.
- Fuentes de luz tienen que afectar a los personajes.

### Lista de escenarios ###
- Isla (Cambio de posición de la fuente de luz):
    - Amanecer:
    - Anochezer:
    - Medio día:
- Calabozo (Cambio de colores):
- Bosque:
    - Muchas fuentes de luz: Luces que van cambiando de color y posición. La sequencia no va ser aleatoria.
    - Noche: 

Buscar modelos 3D para importarlos a las escenas.
Wireframes para diseño de la página para los menús.

Animaciones de todas la figuras.
Agregar objetos desde la interfaz.
*DragControl Three.js
Materiales para las escenas.
*Como agregar un Skybox en Three.js

Orbicontroller Revisar documentacion para evitar que se actualice cuando drag
Agregar objetos a las escenas.
Animar las figuras.
Cambios escena con los tipos de luz.
Agregar las opciones de la interfaz.