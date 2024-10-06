import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuarios.interface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  usuarios: Usuario[] = [];
  nuevoUsuario: Usuario = { nombre: '', email: '', empresa: '' }; // Modelo para el nuevo usuario
  usuarioSeleccionado: Usuario = { nombre: '', email: '', empresa: '' }; // Usuario a editar
  idUsuarioEditar: number | null = null; // ID del usuario a editar
  idUsuarioEliminar: number | null = null; // ID del usuario a eliminar

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerUsuarios();
  }

  // Método para obtener los usuarios
  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users')
      .subscribe(data => {
        this.usuarios = data.map(user => ({
          id: user.id,
          nombre: user.name,
          email: user.email,
          empresa: user.company.name
        }));
      });
  }

  // Método para agregar un nuevo usuario con POST
  agregarUsuario() {
    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post('https://jsonplaceholder.typicode.com/users', body)
      .subscribe(response => {
        console.log('Usuario agregado:', response);
        this.usuarios.push(this.nuevoUsuario); // Actualizamos la lista localmente
        this.nuevoUsuario = { nombre: '', email: '', empresa: '' }; // Limpiamos el formulario
      });
  }

  // Método para seleccionar y mostrar los datos del usuario a editar por ID
  cargarUsuarioParaEditar() {
    const usuario = this.usuarios.find(u => u.id === this.idUsuarioEditar);
    if (usuario) {
      this.usuarioSeleccionado = { ...usuario };
    } else {
      console.error('Usuario no encontrado');
    }
  }

  // Método para editar un usuario con PUT
  editarUsuario() {
    if (this.idUsuarioEditar === null) {
      return;
    }

    const body = {
      name: this.usuarioSeleccionado.nombre,
      email: this.usuarioSeleccionado.email,
      company: {
        name: this.usuarioSeleccionado.empresa
      }
    };

    this.http.put(`https://jsonplaceholder.typicode.com/users/${this.idUsuarioEditar}`, body)
      .subscribe(response => {
        console.log('Usuario editado:', response);
        const indice = this.usuarios.findIndex(u => u.id === this.idUsuarioEditar);
        if (indice > -1) {
          this.usuarios[indice] = this.usuarioSeleccionado; // Actualizamos localmente
        }
        this.usuarioSeleccionado = { nombre: '', email: '', empresa: '' }; // Limpiamos el formulario de edición
        this.idUsuarioEditar = null; // Limpiamos el ID del usuario a editar
      });
  }

  // Método para eliminar un usuario con DELETE
  eliminarUsuario() {
    if (this.idUsuarioEliminar === null) {
      return;
    }

    this.http.delete(`https://jsonplaceholder.typicode.com/users/${this.idUsuarioEliminar}`)
      .subscribe(response => {
        console.log('Usuario eliminado:', response);
        this.usuarios = this.usuarios.filter(u => u.id !== this.idUsuarioEliminar); // Eliminamos localmente
        this.idUsuarioEliminar = null; // Limpiamos el ID del usuario eliminado
      });
  }
}
