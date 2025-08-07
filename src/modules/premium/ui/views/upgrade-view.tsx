"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PricingCard } from "../components/pricing-card";

export const UpgradeView = () => {
   const trpc=useTRPC();
   const {data:currentSubscription} = useSuspenseQuery(trpc.premium.getCurrentSubscription.queryOptions());
    const {data:products} = useSuspenseQuery(trpc.premium.getProducts.queryOptions());


    return (
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-10">
           <div className="mt-4 flex-1 flex flex-col gap-y-10 items-center">
            <h5 className="font-medium text-2xl md:text-3xl">
                You are on the{" "}
                <span className="font-semibold text-primary">
                    {currentSubscription?.name ?? "Free"}
                </span>{" "}
                plan
            </h5>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {products.map((product) => {
                    const isCurrentProduct = currentSubscription?.id === product.id;
                    const isPremium =!!currentSubscription;

                    let buttonText="Upgrade";
                    let onClick=()=>authClient.checkout({products:[product.id]});

                    if(isCurrentProduct) {
                        buttonText="Manage";
                        onClick=()=>authClient.customer.portal();
                    }else if(isPremium) {
                        buttonText="Change Plan";
                        onClick=()=>authClient.customer.portal()
                    }

                    return (
                        <PricingCard
                        key={product.id}
                        variant={product.metadata.variant === "highlighted" ? "highlighted" : "default"}
                        badge={product.metadata.badge as string | null}
                        price={product.prices[0].amountType==="fixed"? product.prices[0].priceAmount/100 : 0}
                        features={product.benefits.map((benefit) => benefit.description)}
                        title={product.name}
                        description={product.description}
                        priceSuffix={`/${product.prices[0].recurringInterval}`}
                        className="h-full"
                        buttonText={buttonText}
                        onClick={onClick}

                        />
                    )
                })}
            </div>
           </div>
        </div>
    )
}
export const UpgradeViewLoading = () => {
return (
  <LoadingState title="Loading..." description="this may take a few seconds"/>
)

};

export const UpgradeViewError=()=>{
  return (
      <ErrorState title="Error " description="Something went wrong "/>
  )
}