import React from 'react';
import { StyleSheet, View, Text, Image,Button } from 'react-native';
import ListItemSeperator from "../components/lists/ListItemSeperator"
import colors from "../config/colors";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';


function OrderInvoiceScreen(props) {
    return (
        
        <View style={styles.background}>
 

          {/*view to insert Storename and visit store button  */} 
          <View style={styles.view2}>
          <Text style={styles.text} >Storename</Text>

          {/*view to edit visit store button  */} 
          <View style={styles.button}>
          <Button  title="Visit Page"/>
          </View>
          </View>
          
          
          <ListItemSeperator/>
           
           {/*view to edit image and name of product  */} 
          <View style={styles.view2}>
          
          <Image source = {{uri:"https://marvel-b1-cdn.bc0a.com/f00000000114841/www.florsheim.com/shop/images/14296-410.jpg"}}
           style = {{ width: 100, height: 100 }}/>
          <Text style={styles.text} >Formal shoes</Text>
           
           
          </View>

           {/*view to edit quantity and number  */} 
          <View style={styles.view2}>
         
          <Text style={styles.text2} >Quantity</Text><Text style={styles.text2} >2</Text>
          </View>
          
          {/*view to edit price and price number  */} 
          <View style={styles.view2}>
           
          <Text style={styles.text2} >Price</Text><Text style={styles.text2} >$27.00</Text>
          </View>

           {/*view to edit Order total and order price  */} 
          <View style={styles.view2}>
          
          <Text style={styles.text} >Order Total</Text><Text style={styles.text2} >$52.00</Text>
          </View>
        
        {/*To edit Payment method title and payment method  */} 
        <ListItemSeperator/>
        <Text style={styles.text} >Payment Method</Text>
        <Text style={styles.text2} >Credit/Debit Card</Text>
        <ListItemSeperator/>

        {/*View to edit Order ID text and order title number  */} 
        <View style={styles.view2}>
        <Text style={styles.text} >Order ID</Text><Text style={styles.text2} >123456543535</Text>
        </View>

        {/*View to edit Order Time text and order date and time  */} 
        <View style={styles.view2}>
        <Text style={styles.text2} >Order Time</Text><Text style={styles.text2} >09/04/2021 20:40</Text>
        </View>

        {/*View to edit tracking status and order date and time  */} 
        <View style={styles.view2}>
        <Text style={styles.text2} >Shopping Time</Text><Text style={styles.text2} >09/04/2021 20:40</Text>
        </View>

        <ListItemSeperator/>
        <View style={styles.button}>
        <Button title="Refund"/>
        </View>
        
         
          
        </View>
    );

    

}

const styles = StyleSheet.create({
    background:{
        flex: 1,
        backgroundColor: colors.white,
         
           
    },
    text:{
        fontWeight: "bold",
        fontSize: 20,
        padding: 15
    },

    text2:{
        
        fontSize: 15,
        padding: 13
    },

    view2:{
        
        flexDirection:"row",
        justifyContent:'space-between'
         
    },

    button:{
      padding: 20,
      
    },
    
});



export default OrderInvoiceScreen;
  

