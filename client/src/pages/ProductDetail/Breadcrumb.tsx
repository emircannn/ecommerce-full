import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import React from "react";

interface BreadcrumbProps {
  breadcrumbs: { name: string; link: string }[];
}

export function BreadcrumbComponent({ breadcrumbs }: BreadcrumbProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="max-lg:text-xs font-medium">
        {/* Anasayfa Bağlantısı */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Anasayfa</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {/* Diğer Breadcrumb Öğeleri */}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink href={crumb.link}>{crumb.name}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
