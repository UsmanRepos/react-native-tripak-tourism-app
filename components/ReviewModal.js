import React from 'react'
import { StyleSheet
  ,Modal, View, Text, TextInput, Button, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

const reviewSchema = Yup.object({
  title: Yup.string().required().min(4),
  body: Yup.string().required().min(8),
  rating: Yup.string().required().test('is_num_1-5', 'Rating Must be a Number 1 - 5', (value) => {
    return '12345'.includes(value);
  })
})

export default function ReviewModal({ addReview, modalVisible, setModalVisible }) {
  return (
    <Modal visible={modalVisible} animationType="slide">
      <TouchableWithoutFeedback /*onPress={ Keyboard.dismiss}*/>
        <View style={styles.modal__content}>
          <MaterialIcons
            name="close"
            size={20}
            onPress={() => { setModalOpen(false) }}
            style={styles.modal__toggle}
          />
          <View style={styles.container}>
            <Formik
              initialValues={{ title: '', body: '', rating: '' }}
              validationSchema={reviewSchema}
              onSubmit={(values) => {
                addReview(values);
              }}
            >
              {(props) => (
                <View>
                  <TextInput
                    placeholder="Review Title"
                    onChangeText={props.handleChange('title')}
                    onBlur={props.handleBlur('title')}
                    value={props.values.title}
                    style={styles.input}
                  />
                  <Text style={styles.error__text}>{props.touched.title && props.errors.title}</Text>
                  <TextInput
                    multiline
                    placeholder="Review Body"
                    onChangeText={props.handleChange('body')}
                    onBlur={props.handleBlur('body')}
                    value={props.values.body}
                    style={styles.input}
                  />
                  <Text style={styles.error__text}>{props.touched.body && props.errors.body}</Text>
                  <TextInput
                    placeholder="Review Rating (1 - 5)"
                    onChangeText={props.handleChange('rating')}
                    onBlur={props.handleBlur('rating')}
                    value={props.values.rating}
                    keyboardType='numeric'
                    style={styles.input}
                  />
                  <Text style={styles.error__text}>{props.touched.rating && props.errors.rating}</Text>
                  <View style={styles.button}>
                    <Button title="submit" onPress={props.handleSubmit} />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: "#fff",
  },
  input: {
    width: '100%',
    padding: 15,
    textTransform: 'capitalize',
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderBottomWidth: 2,
    borderBottomColor: 'cornflowerblue',
    borderStyle: 'solid',
    marginVertical: 10,
    fontFamily: 'nunito-regular',
  },
  error__text: {
    color: 'crimson',
  },
  button: {
    marginTop: 20,
  },
  modal__toggle: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    borderRadius: 15,
    padding: 4,
    alignSelf: "flex-end",
  },
  modal__content: {
    flex: 1,
    padding: 20,
  }
})