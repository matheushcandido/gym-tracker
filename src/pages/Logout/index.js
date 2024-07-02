// src/pages/Logout.js
import React, { useContext } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { AuthContext } from '../../config/authcontext';
import styles from './style';

const Logout = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={logout} style={styles.button}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Logout;
