// ./src/componets/ViolationsComponent.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { fetchViolations, requestViolationsUpdate } from '../../utils/violationsService';

const ViolationsComponent = () => {
  const [violations, setViolations] = useState([]);

  const getViolationsData = async () => {
    const data = await fetchViolations();
    setViolations(data);
  };

  useEffect(() => {
    getViolationsData();
  }, []);

  const handleUpdate = async () => {
    await requestViolationsUpdate();
    getViolationsData();
  };

  return (
    <View>
      <Button title="Update Violations" onPress={handleUpdate} />
      {violations.map(violation => (
        <View key={violation.unique_key}>
          <Text>{violation.plate} - {violation.violation}</Text>
        </View>
      ))}
    </View>
  );
};

export default ViolationsComponent;
