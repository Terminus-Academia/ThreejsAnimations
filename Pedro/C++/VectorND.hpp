#ifndef VECTORND_HPP
#define VECTORND_HPP

#include <initializer_list>
#include <iostream>
#include <fstream>
#include <cstdint>
#include <cmath>

using namespace std;

double invSqrd(double number){
    double y = number;
    double x2= y * 0.5;
    std::int64_t i = *(std::int64_t *)&y;

    i = 0x5fe6eb50c7b537a9 - (i >>1);
    y = y * (1.5 - (x2 * y * y));
    y = y * (1.5 - (x2 * y * y));
    return y;
}

class VectorND{
    protected:
        double *A;
        double norm;
        unsigned int n;

        double chiSqrd(void){
            double sum = 0.0;
            for(int index = 0; index < this->n; ++index)
                sum += this->A[index] * this->A[index];
            return sum;
        }
        void updateNorm(void){ this->norm = sqrt(chiSqrd()); }

    public:
        void initVector( unsigned int N ){
            this->n = N;
            this->A = (double *) malloc (N * sizeof(double));
        }

        VectorND(initializer_list<double> _list){
            this->initVector( _list.size() );
            for(int index = 0; index < _list.size(); ++index)
                this->A[index] = _list.begin()[index];
        }

        VectorND(void){ this->initVector(0); }

        unsigned int dim(void) const;
        double norma(void);
        double axisAng(char,char);
        void append(double);
        double  operator[](int) const;
        double &operator[](int);
        VectorND &operator=(const VectorND&);
        VectorND normalize(void);
        VectorND &operator - (void);
};

double VectorND::norma(void){
    this->updateNorm();
    return this->norm;
}

unsigned int VectorND::dim(void) const{ return this->n; }

double VectorND::operator [] (int index) const{
    index = (index<0) ? index + this->n : index;
    return this->A[index%this->n];
}

double &VectorND::operator [] (int index){
    index = (index<0) ? index + this->n : index;
    return this->A[index%this->n];
}

VectorND &VectorND::operator = (const VectorND& orginal){
    this->initVector( orginal.dim() );
    for(int index = 0; index<orginal.dim(); ++index)
        this->A[index] = orginal[index];
    return *this;
}

VectorND& VectorND::operator - (void){
    for(int index = 0; index<this->n; ++index)
        this->A[index] *= -1;
    return *this;
}

VectorND VectorND::normalize(void){
    VectorND norm = *this;
    for(int index = 0; index<this->n; ++index)
        norm[index] *= invSqrd( chiSqrd() );
    return norm;
}

double VectorND::axisAng(char ax1, char ax2){
    int uno, dos;

    switch (ax1){
    case 'X': case 'x':
        uno = 0;
        break;
    case 'Y': case 'y':
        uno = 1;
        break;
    case 'Z': case 'z':
        uno = 2;
    }
    switch (ax2){
    case 'X': case 'x':
        dos = 0;
        break;
    case 'Y': case 'y':
        dos = 1;
        break;
    case 'Z': case 'z':
        dos = 2;
    }
    double x = this->A[uno], y = this->A[dos], angle;
    if (x > 0 && y >= 0)
        angle = atan2(y, x);
    else if (x == 0 && y > 0)
        angle = M_PI / 2;
    else if (x < 0)
        angle = atan2(y, x) + M_PI;
    else if (x == 0 && y < 0)
        angle = 3 * M_PI / 2;
    else if (x > 0 && y < 0)
        angle = atan2(y, x) + 2 * M_PI;
    else if (x == 0 && y == 0)
        angle = 0;

    return angle;
}

void VectorND::append(double r){
    this->A = (double*) realloc (this->A, (this->n+1) * sizeof(double));
    this->A[this->n] = r;
    this->n += 1;
}

bool operator == (const VectorND& vecA, const VectorND& vecB){
    if( vecA.dim()==vecB.dim() ){
        bool result = true;
        for(int index = 0; index<vecA.dim(); ++index)
            result = result && (vecA[index] == vecB[index]);
        return result;
    }
    cerr << "Not the same dimension in == operator" << endl;
    return false;
}

bool operator != (const VectorND& vecA, const VectorND& vecB){ return !(vecA==vecB); }

VectorND operator + (const VectorND& vecA, const VectorND& vecB){
    VectorND out {};
    if( vecA.dim()==vecB.dim() ){
        out.initVector( vecA.dim() );
        for( int index = 0; index<vecA.dim(); ++index )
            out[index] = vecA[index] + vecB[index];
    }else
        cerr << "Not the same dimension in + operator" << endl;
    return out;
}

VectorND operator - (const VectorND& vecA, const VectorND& vecB){
    VectorND out {};
    if( vecA.dim()==vecB.dim() ){
        out.initVector( vecA.dim() );
        for( int index = 0; index<vecA.dim(); ++index )
            out[index] = vecA[index] - vecB[index];
    }else
        cerr << "Not the same dimension in + operator" << endl;
    return out;
}

VectorND operator * (double f, const VectorND& vecA){
    VectorND out = vecA;
    for(int index = 0; index<vecA.dim(); ++index)
        out[index] *= f;
    return out;
}

VectorND operator / (const VectorND& vecA, double f){
    VectorND out = vecA;
    for(int index = 0; index<vecA.dim(); ++index)
        out[index] /= f;
    return out;
}

VectorND operator % (const VectorND& vecA, const VectorND& vecB){
    if (vecA.dim() != 3 || vecB.dim() != 3)
        cerr << "Done with the first 3 entries (X operator)";
    return VectorND{vecA[1]*vecB[2] - vecA[2]*vecB[1], vecA[2]*vecB[0] - vecA[0]*vecB[2], vecA[0]*vecB[1] - vecA[1]*vecB[0]};
}

double operator * (const VectorND& vecA, const VectorND& vecB){
    double out = 0.0;
    if( vecA.dim()==vecB.dim() ){
        for(int index = 0; index<vecA.dim(); ++index)
            out += vecA[index] * vecB[index];
    }else
        cerr << "Not same dimensions in operator *" << endl;
    return out;
} 

ostream &operator << (ostream &os, const VectorND& vecA){
    os << '<';
    for (int index = 0; index<vecA.dim(); ++index)
        (index < (vecA.dim() - 1)) ? os << vecA[index] << ',' : os << vecA[index] << '>';
    return os;
}

istream& operator >> (istream& is, VectorND& vecA){
    while( !is.eof() && is.get()!='<' )
        ;
    while( is.get() != '>' ){
        if( is.eof() )
            return is;
        else{
            double r;
            is >> r;
            vecA.append(r);
        }
        cerr << "pereo"<< endl;
    }
    return is;
}

// ----- SPECIAL VECTORS --------------------

VectorND O {0,0,0};
VectorND I {1,0,0};
VectorND J {0,1,0};
VectorND K {0,0,1};
VectorND I1{1,1,1};

#endif 
