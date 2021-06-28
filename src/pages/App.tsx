import React, { useState } from 'react';
import { Card, CardContent, Button } from '@material-ui/core';
import { Form, Field, Formik, FormikConfig, FormikValues } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import './App.css';
import { number, object, mixed } from 'yup';


function App() {

  return (

    <Card className="App">
      <CardContent>

        <FormikStepper
          
          initialValues={{
            firstname: '',
            lastname: '',
            miliniore: false,
            money: 0,
            discription: ''
          }} onSubmit={() => { }}>


          <FormikStep>
            <Field name='firstname' component={TextField} label='First Name' />
            <Field name='lastname' component={TextField} label='Last Name' />
            <Field name='miliniore' type="checkbox"component={CheckboxWithLabel} Label={{ label: 'IM MILIONiore' }} />
          </FormikStep>

          <FormikStep  validationSchema={object({
            money: mixed().when('miliniore', {
              is: true,
              then: number().required().min(100000, 'you need to have 1 million'),
              otherwise: number().required()
            })
          })
          }>
            <Field name='money' type="number" component={TextField} label='money' />
          </FormikStep>

          <FormikStep>
            <Field name='discription' component={TextField} label='discription' />
          </FormikStep>

        </FormikStepper >

      </CardContent>
    </Card>
  );
}

export default App;

export interface FormikStepProps 
extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema' > {
  // label:string;
}

export function FormikStep({ children }: FormikStepProps) {
 return <>{children}</>;
}


export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  // const currentChild = childrenArray[step];
  // console.log(currentChild)
  const currentChild = childrenArray[step] ;
  console.log('childs',currentChild.props.validationSchema)




  function lastStep() {
    return step === childrenArray.length - 1;
  }

  return (

    <Formik {...props} 
    validationSchema={currentChild.props.validationSchema}
    onSubmit={async (values, helpers) => {
      if (lastStep()) {
        await props.onSubmit(values, helpers)
      } else {
        setStep(s => s + 1)
      }
    }}>
      <Form autoComplete='off'>{currentChild}

        {step > 0 ? <Button onClick={() => setStep(s => s - 1)}> back </Button> : null}
        <Button type='submit'>{lastStep() ? "Submit" : "Next"}</Button>
      </Form>
    </Formik>


  )
}