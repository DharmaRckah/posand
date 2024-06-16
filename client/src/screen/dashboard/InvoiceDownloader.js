// import React, { useState } from 'react';
// import { View, Text, Button, StyleSheet, Alert, Platform } from 'react-native';
// import RNHTMLtoPDF from 'react-native-html-to-pdf';
// import RNFS from 'react-native-fs';
// import { PermissionsAndroid } from 'react-native';

// const InvoiceDownloader = () => {
//   const [filePath, setFilePath] = useState('');

//   const checkPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//           {
//             title: 'Storage Permission Required',
//             message:
//               'This app needs access to your storage to download the invoice',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         Alert.alert('Permission Error', 'Failed to get permission');
//         return false;
//       }
//     } else {
//       return true;
//     }
//   };

//   const generatePDF = async () => {
//     const htmlContent = `
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; padding: 20px; }
//             h1 { text-align: center; }
//             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
//             th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//             th { background-color: #f2f2f2; }
//           </style>
//         </head>
//         <body>
//           <h1>Invoice</h1>
//           <p>Invoice Date: ${new Date().toLocaleDateString()}</p>
//           <p>Customer Name: John Doe</p>
//           <table>
//             <thead>
//               <tr>
//                 <th>Item</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>Product 1</td>
//                 <td>2</td>
//                 <td>$10</td>
//                 <td>$20</td>
//               </tr>
//               <tr>
//                 <td>Product 2</td>
//                 <td>1</td>
//                 <td>$15</td>
//                 <td>$15</td>
//               </tr>
//               <tr>
//                 <td colspan="3" style="text-align:right;"><strong>Total</strong></td>
//                 <td>$35</td>
//               </tr>
//             </tbody>
//           </table>
//         </body>
//       </html>
//     `;

//     const options = {
//       html: htmlContent,
//       fileName: 'invoice',
//       directory: 'Documents',
//     };

//     try {
//       const file = await RNHTMLtoPDF.convert(options);
//       setFilePath(file.filePath);
//       Alert.alert('Success', `Invoice has been downloaded to: ${file.filePath}`);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to generate PDF');
//     }
//   };

//   const handleDownload = async () => {
//     const isPermissionGranted = await checkPermission();
//     if (isPermissionGranted) {
//       generatePDF();
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Download Invoice</Text>
//       <Button title="Download Invoice" onPress={handleDownload} />
//       {filePath ? <Text style={styles.filePath}>File saved to: {filePath}</Text> : null}
//     </View>
//   );
// };

// export default InvoiceDownloader;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   filePath: {
//     marginTop: 20,
//     fontSize: 14,
//     color: 'gray',
//   },
// });

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const InvoiceDownloader = () => {
  return (
    <View>
      <Text>InvoiceDownloader</Text>
    </View>
  )
}

export default InvoiceDownloader

const styles = StyleSheet.create({})