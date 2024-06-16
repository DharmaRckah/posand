import {
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../component/CustomHeader';
import {DrawerActions} from '@react-navigation/native';
import {Colors} from '../../constant/Colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import {DataTable} from 'react-native-paper';

const {height, width} = Dimensions.get('window');

const PosReport = ({navigation}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(false);
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(false);
    setEndDate(currentDate);
  };

  const handleSearch = () => {
    // Handle search logic here
    console.log('Search from:', startDate, 'to:', endDate);
    Alert.alert(
      'Search',
      `Searching from ${moment(startDate).format('DD-MM-YYYY')} to ${moment(
        endDate,
      ).format('DD-MM-YYYY')}`,
    );
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        title="POS Report"
        onPressMenu={() => navigation.dispatch(DrawerActions.openDrawer())}
      />
      <View style={styles.content}>
        <View style={styles.datePickerContainer}>
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            style={styles.dateInput}>
            <AntDesign name="calendar" color={'#000'} size={24} />
            <Text style={styles.dateText}>
              {moment(startDate).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            style={styles.dateInput}>
            <AntDesign name="calendar" color={'#000'} size={24} />
            <Text style={styles.dateText}>
              {moment(endDate).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dateInput}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 17,
                color: Colors.primary,
              }}>
              <AntDesign name="search1" size={24} color="#000"/>
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.dataTableScroll}>
          {/* Customer Report */}
          <Text style={styles.sectionTitle}>Customer Report</Text>
          <ScrollView showsVerticalScrollIndicator>
            <DataTable style={styles.dataTable}>
              <DataTable.Header>
                <DataTable.Title>Date</DataTable.Title>
                <DataTable.Title>Customer</DataTable.Title>
                <DataTable.Title>Product</DataTable.Title>
                <DataTable.Title>Quantity</DataTable.Title>
                <DataTable.Title>Price</DataTable.Title>
                <DataTable.Title>Total</DataTable.Title>
              </DataTable.Header>
              <DataTable.Row>
                <DataTable.Cell>01-01-2023</DataTable.Cell>
                <DataTable.Cell>John Doe</DataTable.Cell>
                <DataTable.Cell>Product 1</DataTable.Cell>
                <DataTable.Cell>2</DataTable.Cell>
                <DataTable.Cell>$10</DataTable.Cell>
                <DataTable.Cell>$20</DataTable.Cell>
              </DataTable.Row>
              <DataTable.Row>
                <DataTable.Cell>02-01-2023</DataTable.Cell>
                <DataTable.Cell>Jane Smith</DataTable.Cell>
                <DataTable.Cell>Product 2</DataTable.Cell>
                <DataTable.Cell>1</DataTable.Cell>
                <DataTable.Cell>$15</DataTable.Cell>
                <DataTable.Cell>$15</DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </ScrollView>

          {/* Sales Report */}
          <Text style={styles.sectionTitle}>Sales Report</Text>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Invoice No</DataTable.Title>
              <DataTable.Title>Customer</DataTable.Title>
              <DataTable.Title>Amount</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>01-01-2023</DataTable.Cell>
              <DataTable.Cell>INV-001</DataTable.Cell>
              <DataTable.Cell>John Doe</DataTable.Cell>
              <DataTable.Cell>$200</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>02-01-2023</DataTable.Cell>
              <DataTable.Cell>INV-002</DataTable.Cell>
              <DataTable.Cell>Jane Smith</DataTable.Cell>
              <DataTable.Cell>$150</DataTable.Cell>
            </DataTable.Row>
          </DataTable>

          {/* POS Report */}
          <Text style={styles.sectionTitle}>POS Report</Text>
          <DataTable style={styles.dataTable}>
            <DataTable.Header>
              <DataTable.Title>Date</DataTable.Title>
              <DataTable.Title>Transaction ID</DataTable.Title>
              <DataTable.Title>Amount</DataTable.Title>
              <DataTable.Title>Payment Method</DataTable.Title>
            </DataTable.Header>

            <DataTable.Row>
              <DataTable.Cell>01-01-2023</DataTable.Cell>
              <DataTable.Cell>TXN-001</DataTable.Cell>
              <DataTable.Cell>$200</DataTable.Cell>
              <DataTable.Cell>Cash</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell>02-01-2023</DataTable.Cell>
              <DataTable.Cell>TXN-002</DataTable.Cell>
              <DataTable.Cell>$150</DataTable.Cell>
              <DataTable.Cell>Card</DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </ScrollView>
      </View>
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode={'date'}
          display="default"
          onChange={onChangeStartDate}
        />
      )}
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode={'date'}
          display="default"
          onChange={onChangeEndDate}
        />
      )}
    </View>
  );
};

export default PosReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backColor,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dateText: {
    marginLeft: 10,
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
  },
  dataTableScroll: {
    height: height - 200,
    marginBottom: 20,
    backgroundColor: Colors.secondary,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingLeft: 10,
    backgroundColor: '#f8f8f8',
    paddingVertical: 5,
  },
  dataTable: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff',
    width: '98%',
    marginHorizontal: 4,
    height:height/5
  },
});
