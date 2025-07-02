
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

  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsFormVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="contact" className="py-32 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-16">
        <div className="max-w-2xl mx-auto">
          {/* Interactive Form Container */}
          <div 
            className="bg-white/90 backdrop-blur-sm p-24 rounded-3xl shadow-elegant-panel hover:shadow-2xl transition-all duration-700 group"
            style={{
              opacity: isFormVisible ? 1 : 0,
              transform: isFormVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.95)',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            {/* Glow background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-terracotta-50/0 via-terracotta-100/10 to-terracotta-50/0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            
            <div className="text-center mb-24 relative z-10">
              <h2 className="text-6xl md:text-7xl font-elegant-heading text-elegant-dark mb-12 font-light tracking-[-0.02em] relative inline-block transition-all duration-700 group-hover:text-terracotta-600">
                BOEKINGS<br />
                <span className="relative">
                  AANVRAAG
                  <span className="absolute inset-0 blur-3xl bg-terracotta-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
                </span>
              </h2>
              <div className="relative w-24 h-px bg-terracotta-600 mx-auto mb-12 overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
              </div>
              <p className="text-elegant-dark font-elegant-body text-xl leading-relaxed font-light transition-all duration-700 group-hover:text-elegant-grey-700">
                Vul jeje hieg on details en perfeebingxen<br />
                te zubmiet jow resservaterrnnrsje utraast
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12 relative z-10">
              <div className="relative group/field">
                <Input
                  placeholder="Naam"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onFocus={() => handleFocus("name")}
                  onBlur={() => handleBlur("name")}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-terracotta-600 bg-transparent font-elegant-body font-light text-lg placeholder:text-gray-400 rounded-none transition-all duration-500 hover:border-terracotta-300"
                  required
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta-600 transition-all duration-700 group-focus-within/field:w-full"></span>
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-terracotta-400/30 blur-sm transition-all duration-700 group-focus-within/field:w-full"></span>
              </div>
              
              <div className="relative group/field">
                <Input
                  type="email"
                  placeholder="E-mailadres"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onFocus={() => handleFocus("email")}
                  onBlur={() => handleBlur("email")}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-terracotta-600 bg-transparent font-elegant-body font-light text-lg placeholder:text-gray-400 rounded-none transition-all duration-500 hover:border-terracotta-300"
                  required
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta-600 transition-all duration-700 group-focus-within/field:w-full"></span>
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-terracotta-400/30 blur-sm transition-all duration-700 group-focus-within/field:w-full"></span>
              </div>
              
              <div className="relative group/field">
                <Textarea
                  placeholder="Bericht"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onFocus={() => handleFocus("message")}
                  onBlur={() => handleBlur("message")}
                  className="w-full px-0 py-4 border-0 border-b-2 border-gray-200 focus:border-terracotta-600 bg-transparent min-h-[120px] resize-none font-elegant-body font-light text-lg placeholder:text-gray-400 rounded-none transition-all duration-500 hover:border-terracotta-300"
                  required
                />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta-600 transition-all duration-700 group-focus-within/field:w-full"></span>
                <span className="absolute -bottom-1 left-0 w-0 h-1 bg-terracotta-400/30 blur-sm transition-all duration-700 group-focus-within/field:w-full"></span>
              </div>
              
              <Button 
                type="submit"
                variant="interactive-primary"
                size="luxury-xl"
                className="w-full mt-16 font-light group"
              >
                <span className="relative z-10">Versturen</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Interactive Our Story Section */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="container mx-auto px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
              {/* Interactive Content */}
              <div 
                className="group cursor-pointer"
                style={{
                  opacity: isFormVisible ? 1 : 0,
                  transform: isFormVisible ? 'translateX(0)' : 'translateX(-50px)',
                  transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s'
                }}
              >
                <h2 className="text-7xl md:text-8xl font-elegant-heading text-elegant-dark mb-20 font-light tracking-[-0.02em] relative inline-block transition-all duration-700 group-hover:text-terracotta-600">
                  ONS VERHAAL
                  <span className="absolute inset-0 blur-3xl bg-terracotta-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
                </h2>
                <div className="relative w-24 h-px bg-terracotta-600 mb-16 overflow-hidden">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-terracotta-400 to-transparent animate-pulse"></span>
                </div>
                <div className="text-elegant-dark font-elegant-body text-2xl leading-relaxed font-light transition-all duration-700 group-hover:text-elegant-grey-700">
                  <p className="transform transition-all duration-700 group-hover:translate-x-2">
                    Wesley's Ambacht smoken opstreds traditionele technieken en rijjen logae 
                    ingredienten voor de verkoop en frese. In vorms ommen kombaarkaas, hegema-
                    gemaakte brooden en vart visen Minimaal E-numreken gemiddels 
                    en we er gaan vred je handelaagr.
                  </p>
                </div>
              </div>

              {/* Interactive Image Area */}
              <div 
                className="relative h-96 bg-gradient-to-br from-terracotta-100 via-terracotta-200 to-terracotta-300 rounded-2xl overflow-hidden group"
                style={{
                  opacity: isFormVisible ? 1 : 0,
                  transform: isFormVisible ? 'translateX(0) scale(1)' : 'translateX(50px) scale(0.95)',
                  transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
                }}
              >
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-terracotta-600/20 via-transparent to-terracotta-400/20 animate-pulse"></div>
                
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-terracotta-400/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                
                {/* Decorative elements */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20 font-elegant-script text-8xl animate-organic-float">
                  Wesley's
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
