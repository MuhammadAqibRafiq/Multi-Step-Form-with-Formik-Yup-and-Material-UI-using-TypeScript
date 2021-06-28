import React, { useState } from 'react';
import { Card, CardContent, Button , Box , Stepper, Step, StepLabel } from '@material-ui/core';
import { Form, Field, Formik, FormikConfig, FormikValues } from 'formik';
import { TextField, CheckboxWithLabel } from 'formik-material-ui';
import './App.css';
import { number, object, mixed } from 'yup';
import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

const sleep = (time: number | undefined) => new Promise((acc) => setTimeout(acc, time));

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
          }} onSubmit={async (values) => {
            await sleep(3000);
            console.log('values', values);
          }}>


          <FormikStep label='Personal Info'>
            <Box>
            <Field fullWidth name='firstname' component={TextField} label='First Name' />
            </Box>
            <Box>
            <Field  fullWidth name='lastname' component={TextField} label='Last Name' />
            </Box>
            <Box>
            <Field name='miliniore' type="checkbox"component={CheckboxWithLabel} Label={{ label: 'IM MILIONIORE' }} />
            </Box>

          </FormikStep>

          <FormikStep label='Money'  validationSchema={object({
            money: mixed().when('miliniore', {
              is: true,
              then: number().required().min(100000, 'you need to have 1 million'),
              otherwise: number().required()
            })
          })
          }>
            <Field  fullWidth name='money' type="number" component={TextField} label='Money' />
          </FormikStep>

          <FormikStep label='Discription'>
            <Field fullWidth name='Discription' component={TextField} label='Discription' />
          </FormikStep>

        </FormikStepper >

      </CardContent>
    </Card>
  );
}

export default App;

export interface FormikStepProps 
extends Pick<FormikConfig<FormikValues>, 'children' | 'validationSchema' > {
  label:string;
}

export function FormikStep({ children }: FormikStepProps) {
 return <>{children}</>;
}


export function FormikStepper({ children, ...props }: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step] ;
  // console.log('childs',currentChild.props.validationSchema)




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

      {({isSubmitting })=>(

      <Form autoComplete='off'>

      <Stepper activeStep={step} alternativeLabel>
        {childrenArray.map((child) => (
          <Step key={child.props.label}>
            <StepLabel>{child.props.label}</StepLabel>
          </Step>
           ))}
           </Stepper>

            {currentChild}

            <br/ >
            <br/ >

        {step > 0 ? <Button variant="contained" disabled={isSubmitting}
                color="primary" onClick={() => setStep(s => s - 1)}>back</Button> : null}

        <Button variant="contained"  disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                 type='submit'>{isSubmitting ? 'Submitting' : lastStep() ? "Submit" : "Next"}</Button>
      </Form>
      )}
    </Formik>


  )
}