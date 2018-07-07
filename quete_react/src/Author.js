import React, { Component } from 'react';

class Author extends Component {
    afficherNom()
    {
        alert(this.props.name);
    }

  render() {

    return (
        <input type="button" value="Auteur" onClick={this.afficherNom.bind(this)} />
    );
  }
}

export default Author;
