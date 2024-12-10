
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

    // Cargar las solicitudes al cargar la página
    cargarDatosYTabla();

    // Función para cargar los datos y luego la tabla
    function cargarDatosYTabla() {
        $.ajax({
            url: 'https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes', // Cambia esta URL por la correcta
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
                <tr>
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
    $('.detalle').hide();
    $('.detalleUpdate').hide();
});

    // Boton nuevo
    $("#botonNuevo").on('click', function () {
        // $(".detalle").removeClass("oculto").addClass("visible");
        $(".detalleUpdate").hide();
        $(".detalle").toggle();
        $("#nombre").val(""); // Limpiar los campos
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
            url: 'https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes', // URL del servidor para agregar el registro
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

    
    $('#tabla tbody').on('click', 'tr', function () {
        // Obtener el ID desde el botón de la fila
        const id = $(this).find('.botonBorrar').data('id');
    
        // Obtener el nombre y apellido de las celdas correspondientes
        const nombre = $(this).find('td').eq(0).text(); // La primera celda (nombre)
        const apellido = $(this).find('td').eq(1).text(); // La segunda celda (apellido)
    
        // Rellenar los input con los valores
        $("#nombreUpdate").val(nombre); 
        $("#apellidoUpdate").val(apellido);
    
        // Mostrar la zona de detalle
        $(".detalleUpdate").show();
        // Ocultar el .detalle si está activo
        $(".detalle").hide();

        // Guardar el ID en un campo oculto 
        $("#detalleId").val(id);
    });

    $('#botonEditar').on('click', function () {
        // Obtener los valores del formulario
        const nombre = $("#nombreUpdate").val().trim();
        const apellido = $("#apellidoUpdate").val().trim();
        const id = $("#detalleId").val(); // Obtener el ID desde el campo oculto
    
        // Validar los campos
        if (nombre === "" || apellido === "") {
            alert("Por favor, complete todos los campos.");
            return;
        }
    
        // Crear el objeto con los datos actualizados
        const data = {
            nombre: nombre,
            apellido: apellido
        };
    
        // Realizar la petición PUT para actualizar el registro
        $.ajax({
            url: `https://my-json-server.typicode.com/desarrollo-seguro/dato/solicitudes/${id}`, // URL con el ID
            method: 'PUT',
            data: JSON.stringify(data), // Convertir el objeto a JSON
            contentType: 'application/json', // Asegurarse de enviar el contenido como JSON
            success: function (response) {
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