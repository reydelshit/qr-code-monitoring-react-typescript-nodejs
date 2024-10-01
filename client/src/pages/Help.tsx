import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Help = () => {
  return (
    <div className="flex h-full flex-col items-center overflow-x-auto">
      <h1 className="my-4 text-6xl font-bold">FAQs</h1>
      <div className="flex w-[70%] justify-start">
        <Button>
          <Link to={'/scan'}>Back to Scan Station</Link>
        </Button>{' '}
      </div>
      <div className="mt-[2rem] flex w-full flex-col items-center justify-center">
        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How to time in/time out?</AccordionTrigger>
            <AccordionContent>
              Easily, just place your student ID's qr code in front of the
              camera to be able to time in or time out.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Will my parent/guardian be notified of my attendance?
            </AccordionTrigger>
            <AccordionContent>
              Yes, an SMS notification is automatically sent to your
              parent/guardian when you time in or out.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What if I forget my student ID?</AccordionTrigger>
            <AccordionContent>
              Don't worry! You can manually input your student ID number into
              the system.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              How will I know if I’ve successfully timed in or out?
            </AccordionTrigger>
            <AccordionContent>
              The system will display a confirmation message and send an SMS
              notification to your parent/guardian.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What happens if I lose my student ID?
            </AccordionTrigger>
            <AccordionContent>
              You can request a replacement ID from the school's office. In the
              meantime, you can manually enter your ID number to track
              attendance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Can I time in/out for someone else?
            </AccordionTrigger>
            <AccordionContent>
              No, each student must scan their own ID to ensure accurate
              attendance tracking.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              What should I do if my QR code isn't working?
            </AccordionTrigger>
            <AccordionContent>
              Try cleaning the ID and scanning it again. If it still doesn't
              work, report it to the admin for assistance.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Accordion className="w-[70%]" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              Is there a limit to how many times I can time in or out in a day?
            </AccordionTrigger>
            <AccordionContent>
              No, the system will log every instance of time in and time out for
              tracking purposes.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default Help;
