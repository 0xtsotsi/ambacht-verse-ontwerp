
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLifecycleLogger, useStateLogger, usePerformanceLogger } from "@/hooks/useComponentLogger";
import { UserFlowLogger, LoggerUtils } from "@/lib/logger";
import { useFormAnalytics, FormField } from "@/lib/formLogger";
import { useConversionFunnel } from "@/lib/conversionFunnel";
import { useInteractionLogger, useBreadcrumbLogger } from "@/hooks/useUserFlowLogger";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export const BookingForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: ""
  });

  // Component logging setup
  useLifecycleLogger({ 
    componentName: 'BookingForm',
    props: { hasInitialData: Object.values(formData).some(v => v.length > 0) },
    enablePropLogging: true
  });

  const { logStateChange } = useStateLogger<FormData>({ 
    componentName: 'BookingForm',
    stateName: 'formData'
  });

  const { getPerformanceStats } = usePerformanceLogger({
    componentName: 'BookingForm',
    slowRenderThreshold: 20
  });

  // User flow tracking
  const { logFormInteraction, logButtonPress } = useInteractionLogger();
  const { addBreadcrumb, logJourneySummary } = useBreadcrumbLogger();
  
  // Form analytics
  const formFields: FormField[] = [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'message', type: 'textarea', required: true }
  ];
  
  const {
    initializeForm,
    trackFocus,
    trackBlur,
    trackChange,
    trackSubmission,
    trackAbandonment,
    logFunnelStep,
    cleanup
  } = useFormAnalytics('BookingForm', formFields);

  // Conversion funnel tracking
  const { startFunnel, logStep, complete, abandon } = useConversionFunnel('contact_form');

  // Initialize form tracking
  useEffect(() => {
    const formKey = initializeForm();
    const funnelId = startFunnel();
    
    addBreadcrumb('booking_form_loaded');
    logStep('form_view');
    
    return () => {
      cleanup();
    };
  }, []);

  // Log state changes when formData updates
  useEffect(() => {
    logStateChange(formData, 'form_field_update');
  }, [formData, logStateChange]);

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();
      
      logButtonPress('submit_booking_form', 'BookingForm');
      addBreadcrumb('form_submission_attempt', { formData });
      
      // Track form submission
      const validationErrors: string[] = [];
      if (!formData.name.trim()) validationErrors.push('Name is required');
      if (!formData.email.trim()) validationErrors.push('Email is required');
      if (!formData.message.trim()) validationErrors.push('Message is required');
      
      const isSuccessful = validationErrors.length === 0;
      
      trackSubmission(formData, validationErrors, isSuccessful);
      
      if (isSuccessful) {
        logStep('form_submission');
        complete({ 
          formData: LoggerUtils.sanitizeData(formData),
          submissionTime: Date.now()
        });
        
        addBreadcrumb('booking_form_submitted_successfully');
        logJourneySummary('completed');
        
        toast({
          title: "Bericht Verzonden!",
          description: "Bedankt voor uw bericht. Wij nemen snel contact met u op.",
        });
        
        const resetData = { name: "", email: "", message: "" };
        setFormData(resetData);
        logStateChange(resetData, 'form_reset_after_submit');
      } else {
        addBreadcrumb('form_submission_failed', { errors: validationErrors });
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      UserFlowLogger.error('form_submission_error', 'Failed to submit booking form', { error, formData });
      abandon('error', { error: error.message });
      addBreadcrumb('form_submission_error', { error: error.message });
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    try {
      const previousValue = formData[field];
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Track field changes
      trackChange(field, value);
      logFormInteraction('change', 'BookingForm', field, value);
      
      // Track first interaction
      if (!previousValue && value) {
        logStep('first_field_interaction');
        addBreadcrumb('first_form_interaction', { field });
      }
      
      // Track form completion progress
      const updatedData = { ...formData, [field]: value };
      const completedFields = Object.values(updatedData).filter(v => v.trim().length > 0).length;
      const completionPercentage = (completedFields / 3) * 100;
      
      if (completionPercentage === 100) {
        logStep('form_completion');
        addBreadcrumb('form_fully_completed');
      }
      
      addBreadcrumb('field_updated', { 
        field, 
        completion: completionPercentage,
        valueLength: value.length 
      });
      
    } catch (error) {
      console.error('Form field change error:', error);
      UserFlowLogger.error('form_field_error', `Failed to update field ${field}`, { error, field, value });
    }
  };

  // Handle field focus
  const handleFocus = (field: keyof FormData) => {
    trackFocus(field);
    logFormInteraction('focus', 'BookingForm', field);
    addBreadcrumb('field_focused', { field });
  };

  // Handle field blur
  const handleBlur = (field: keyof FormData) => {
    trackBlur(field);
    logFormInteraction('blur', 'BookingForm', field);
  };

  // Handle form abandonment on unmount
  useEffect(() => {
    return () => {
      const hasAnyData = Object.values(formData).some(v => v.trim().length > 0);
      if (hasAnyData) {
        trackAbandonment('navigation');
        abandon('navigation');
        addBreadcrumb('form_abandoned_with_data');
        logJourneySummary('abandoned');
      }
    };
  }, [formData]);

  return (
    <section id="contact" className="py-32 bg-gray-50">
      <div className="container mx-auto px-16">
        <div className="max-w-2xl mx-auto">
          {/* Clean Form */}
          <div className="bg-white p-24 border-0 shadow-none">
            <div className="text-center mb-24">
              <h2 className="text-6xl md:text-7xl font-elegant-heading text-elegant-dark mb-12 font-light tracking-[-0.02em]">
                BOEKINGS<br />
                AANVRAAG
              </h2>
              <div className="w-24 h-px bg-terracotta-600 mx-auto mb-12"></div>
              <p className="text-elegant-dark font-elegant-body text-xl leading-relaxed font-light">
                Vul jeje hieg on details en perfeebingxen<br />
                te zubmiet jow resservaterrnnrsje utraast
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
              <Input
                placeholder="Naam"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onFocus={() => handleFocus("name")}
                onBlur={() => handleBlur("name")}
                className="w-full px-0 py-4 border-0 border-b border-gray-200 focus:border-terracotta-600 bg-transparent font-elegant-body font-light text-lg placeholder:text-gray-400 rounded-none"
                required
              />
              
              <Input
                type="email"
                placeholder="E-mailadres"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
                className="w-full px-0 py-4 border-0 border-b border-gray-200 focus:border-terracotta-600 bg-transparent font-elegant-body font-light text-lg placeholder:text-gray-400 rounded-none"
                required
              />
              
              <Textarea
                placeholder="Bericht"
                value={formData.message}
                onChange={(e) => handleChange("message", e.target.value)}
                onFocus={() => handleFocus("message")}
                onBlur={() => handleBlur("message")}
                className="w-full px-0 py-4 border-0 border-b border-gray-200 focus:border-terracotta-600 bg-transparent min-h-[120px] resize-none font-elegant-body font-light text-lg placeholder:text-gray-400 rounded-none"
                required
              />
              
              <Button 
                type="submit"
                variant="luxury-primary"
                size="luxury-xl"
                className="w-full mt-16 font-light"
              >
                Versturen
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              {/* Content */}
              <div>
                <h2 className="text-7xl md:text-8xl font-elegant-heading text-elegant-dark mb-20 font-light tracking-[-0.02em]">
                  ONS VERHAAL
                </h2>
                <div className="w-24 h-px bg-terracotta-600 mb-16"></div>
                <div className="text-elegant-dark font-elegant-body text-2xl leading-relaxed font-light">
                  <p>
                    Wesley's Ambacht smoken opstreds traditionele technieken en rijjen logae 
                    ingredienten voor de verkoop en frese. In vorms ommen kombaarkaas, hegema-
                    gemaakte brooden en vart visen Minimaal E-numreken gemiddels 
                    en we er gaan vred je handelaagr.
                  </p>
                </div>
              </div>

              {/* Clean Image Area */}
              <div className="h-96 bg-gray-100"></div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
