
// solicitudes = [
//     {
//         "id": 1,
//         "nombre": "Fernando",
//         "apellido": "Alguno"
//     },
//     {
//         "id": 2,
//         "nombre": "Nico",
//         "apellido": "Otro"
//     }
// ];


$(function () {

    // Cargar los datos al cargar la página
    cargarDatosYTabla();

    // Función para cargar los datos y luego la tabla
    function cargarDatosYTabla() {
        $.ajax({
            url: 'https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes',
            method: 'GET',
            success: function (data) {
                // Llamar a la función para cargar la tabla con los datos obtenidos
                cargarTabla(data);
            },
            error: function (error) {
                console.error('Error al obtener los datos:', error);
                alert('No se pudo obtener los datos. Inténtalo de nuevo.');
            }
        });
    }

    // Función para cargar las solicitudes en la tabla
    function cargarTabla(solicitudes) {
        const $cuerpoTabla = $("#tabla tbody");
        $cuerpoTabla.empty(); // Limpiar tabla

        // Recorrer las solicitudes y crear filas dinámicas
        solicitudes.forEach((persona) => {
            const fila = `
                <tr data-id="${persona.id}"> 
                    <td>${persona.nombre}</td>
                    <td>${persona.apellido}</td>
                    <td>
                        <button class="btn btn-danger botonBorrar p-2" data-id="${persona.id}">Borrar</button>
                    </td>
                </tr>`;
            $cuerpoTabla.append(fila);
        });
        // Boton borrar
        $('.botonBorrar').on('click', function () {

            // Obtener el ID del recurso desde el atributo data-id del botón
            const id = $(this).data('id');
            const url = `https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/${id}`;

            // Ocultar detalle
            $(".detalle").hide();
            $(".detalleUpdate").hide();

            // Confirmación de eliminación
            if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                // Petición AJAX DELETE
                $.ajax({
                    url: url,
                    method: 'DELETE',
                    success: function () {
                        alert('Registro eliminado con éxito');
                        // Eliminar la fila de la tabla (el ancestro más cercano <tr>)
                        $(this).closest('tr').remove();
                    }.bind(this), // Asegurar que 'this' sea el botón dentro del success
                    error: function (error) {
                        console.error('Error al eliminar:', error);
                        alert('No se pudo eliminar el registro. Inténtalo de nuevo.');
                    }
                });
            }
        });
    }


    // Boton refrescar
    $("#botonRefrescar").on('click', function () {
        $.ajax({
            url: 'https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes',
            method: 'GET',
            success: function (data) {
                cargarTabla(data);
            },
            error: function (error) {
                console.error('Error al obtener los datos:', error);
                alert('No se pudo obtener los datos. Inténtalo de nuevo.');
            }
        });
        // Ocultar detalles
        $('.detalle').hide();
        $('.detalleUpdate').hide();
    });

    // Boton nuevo
    $("#botonNuevo").on('click', function () {
        // $(".detalle").removeClass("oculto").addClass("visible");

        $(".detalleUpdate").hide(); // Ocultar el detalleUpdate si esta visible
        $(".detalle").toggle(); // Mostrar el detalle
        // Limpiar los campos
        $("#nombre").val("");
        $("#apellido").val("");
    });

    // Boton cancelar
    $(".botonCancelar").on('click', function () {
        // $(".detalle").removeClass("visible").addClass("oculto");
        $(".detalle").hide();
        $(".detalleUpdate").hide();
    });

    //Boton guardar (POST)
    $("#botonGuardar").on('click', function () {
        // Eliminar los espacios en blanco
        const nombre = $("#nombre").val().trim();
        const apellido = $("#apellido").val().trim();

        // Validar los campos
        if (nombre === "" || apellido === "") {
            alert("Por favor, complete todos los campos.");
            return;
        }

        // Crear un objeto con los datos del nuevo registro
        const data = { nombre: nombre, apellido: apellido };

        // Hacer un POST al servidor para agregar el nuevo registro
        $.ajax({
            url: 'https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes',
            method: 'POST',
            data: JSON.stringify(data), // Convertir a JSON
            success: function (data) {
                alert('Registro guardado con éxito');
                // Recargar los datos y la tabla después de guardar el registro
                cargarDatosYTabla();
                // Ocultar el formulario
                $(".detalle").hide();
            },
            error: function (error) {
                console.error('Error al guardar el registro:', error);
                alert('No se pudo guardar el registro. Inténtalo de nuevo.');
            }
        });
    });

    // Hacer clic en una fila
    // Primero, asignamos un identificador al evento de clic en la fila
    $('#tabla tbody').on('click', 'tr', function (e) {
        // Comprobar si el clic no fue en un botón de borrar
        if (!$(e.target).hasClass('botonBorrar')) {

            // Obtener el ID desde el atributo data-id de la fila
            const id = $(this).data('id');

            // Asegúrate de que el ID esté correcto
        console.log("ID de la fila: ", id);  // Esto debería mostrar el ID correcto de la fila

            // Guardar el nombre y apellido de la fila que se ha hecho clic
            // .eq(index) es similar a acceder a los elementos por su índice en un array 
            const nombre = $(this).find('td').eq(0).text(); // La primera celda (nombre)
            const apellido = $(this).find('td').eq(1).text(); // La segunda celda (apellido)

            // En los inout ponemos el nombre y apellido
            $("#nombreUpdate").val(nombre);
            $("#apellidoUpdate").val(apellido);

            // Mostrar la zona de detalle
            $(".detalleUpdate").show();
            // Ocultar el .detalle si está activo
            $(".detalle").hide();

            // Guardar el ID en un campo oculto 
            $("#detalleId").val(id);
        }
    });

    // Boton editar
    $('#botonEditar').on('click', function () {
        // Obtener los valores del formulario sin espacios en blanco
        const nombre = $("#nombreUpdate").val().trim();
        const apellido = $("#apellidoUpdate").val().trim();
        const id = $("#detalleId").val(); // Obtener el ID desde el campo oculto

        // Validar los campos
        if (nombre === "" || apellido === "") {
            alert("Por favor, complete todos los campos.");
            return; //  evitar que el código continúe ejecutándose si los campos no han sido completados correctamente
        }

        // Crear el objeto con los datos actualizados
        const data = {
            nombre: nombre,
            apellido: apellido
        };

        // Realizar la petición PUT para actualizar el registro
        $.ajax({
            url: `https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/${id}`,
            method: 'PUT',
            data: JSON.stringify(data), // Convertir el objeto a JSON
            contentType: 'application/json',
            success: function (data) {
                alert('Registro actualizado con éxito');
                // Recargar los datos y la tabla después de actualizar el registro
                cargarDatosYTabla();
                // Ocultar el formulario de detalle
                $(".detalleUpdate").hide();
            },
            error: function (error) {
                console.error('Error al actualizar el registro:', error);
                alert('No se pudo actualizar el registro. Inténtalo de nuevo.');
            }
        });
    });
});