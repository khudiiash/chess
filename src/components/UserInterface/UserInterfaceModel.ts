import { IModel } from "@/interfaces";

class UserInterfaceModel implements IModel {

  state: any;
  
  constructor() {

    this.state = {

    }

  }

  get styles() {
    return {

      openMenuButton: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        width: '60px',
        height: '30px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        userSelect: 'none',
        color: 'white',
        fontSize: '12px',
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '3px',
      },

      button: {
        width: '120px',
        height: '40px',
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(5px)',
        border: 'none',
        borderRadius: '5px',
        color: 'white',
        cursor: 'pointer',
        userSelect: 'none',
        letterSpacing: '2px',
        margin: '10px',
        outline: 'none',
        textTransform: 'uppercase',
      },

      menu: {
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(155, 155, 155, 0.15)',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'none',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },

      panel: {
        width: '20%',
        height: '100%',
        padding: '10px',
      }

    }
  }

}

export default UserInterfaceModel;